import conf from "../config/ConfigID";
import { Client, TablesDB, Query, ID } from "appwrite";
import notificationService from "./notifications";
import likeService from "./likes";
import type { MatchDocument, UserProfile } from "../types";
export class MatchService {
  client = new Client();
  tables: TablesDB;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  // 🔍 1) Find a potential match (does not save)
  // 🔍 1) Find and rank all potential matches
  async findMatch(currentUserId: string): Promise<Array<UserProfile & { score: number }>> {
    try {
      // Get current user's profile
      const user = await this.tables.getRow<UserProfile>({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: currentUserId,
      });

      if (!user) return [];

      // Get user's match document to exclude already liked/matched users
      const userMatchDoc = await this.getMatchDocByUserId(currentUserId);
      const alreadyMatchedIds = userMatchDoc?.MatchedUsers || [];
      const sentLikes = await likeService.getSentLikes(currentUserId);
      const alreadyLikedIds = sentLikes
        .filter((like) => like.Status !== "rejected" && like.Status !== "blocked")
        .map((like) => like.ReceiverId);

      // Fetch all other users
      const matches = await this.tables.listRows<UserProfile>({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        queries: [Query.notEqual("$id", currentUserId)],
      });

      if (matches.total === 0) return [];

      // 🧮 Score function
      const calcScore = (candidate: UserProfile): number => {
        let score = 0;
        const sharedTopics = candidate.Topics?.filter((t) =>
          user.Topics?.some((ut) => ut.toLowerCase() === t.toLowerCase())
        ) || [];
        score += sharedTopics.length * 5;
        return score;
      };

      // Rank and filter
      const ranked = matches.rows
        .filter((c) => !alreadyMatchedIds.includes(c.$id) && !alreadyLikedIds.includes(c.$id))
        .map((c) => ({
          ...c,
          score: calcScore(c),
        }))
        .filter((c) => c.score > 0) // remove non-relevant users
        .sort((a, b) => b.score - a.score);

      return ranked;
    } catch (error) {
      console.error("❌ Error finding match:", error);
      throw error;
    }
  }

  // Get user by ID
async getUserById(userId: string): Promise<UserProfile> {
  return await this.tables.getRow<UserProfile>({
    databaseId: conf.appwriteDatabaseId,
    tableId: conf.appwriteUsersCollectionId,
    rowId: userId,
  });
}

async getMatchDocByUserId(userId: string): Promise<MatchDocument | null> {
    try {
      const res = await this.tables.listRows<MatchDocument>({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritematchesCollectionId,
        queries: [Query.equal("UserId", userId)],
      });

      return res.rows[0] || null;
    } catch (err) {
      console.error("❌ Error fetching matchDoc:", err);
      return null;
    }
  }

  // Get matched user profiles directly
  async getMatchedProfiles(userId: string, authService: { getUsersByIds: (ids: string[]) => Promise<UserProfile[]> }): Promise<UserProfile[]> {
    try {
      const matchDoc = await this.getMatchDocByUserId(userId);
      let matchedIds = matchDoc?.MatchedUsers || [];

      // Older match rows stored both participants but were only indexed to the
      // user who initiated the like. Use Participants as a compatibility path.
      if (!matchedIds.length) {
        const participantMatches = await this.tables.listRows<MatchDocument>({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwritematchesCollectionId,
          queries: [Query.contains("Participants", userId)],
        });
        matchedIds = participantMatches.rows.flatMap((row) => row.MatchedUsers || []);
      }

      matchedIds = [...new Set(matchedIds)].filter((id) => id !== userId);
      if (!matchedIds.length) return [];

      const profiles = await authService.getUsersByIds(matchedIds);
      return profiles;
    } catch (err) {
      console.error("❌ Error fetching matched profiles:", err);
      return [];
    }
  }


// Find common topics (case-insensitive)
getCommonTopics(userTopics: string[] = [], matchedTopics: string[] = []): string[] {
  const userNormalized = userTopics.map((t) => t.toLowerCase());
  const matchedNormalized = matchedTopics.map((t) => t.toLowerCase());
  return userNormalized.filter((topic) => matchedNormalized.includes(topic));
}

// Create or update match doc for a user
async upsertMatchDoc(userId: string, level: string | undefined, matchedUserId: string, commonTopics: string[]) {
  const userDoc = await this.tables.listRows<MatchDocument>({
    databaseId: conf.appwriteDatabaseId,
    tableId: conf.appwritematchesCollectionId,
    queries: [Query.equal("UserId", userId)],
  });

  if (userDoc.total === 0) {
    // Create new match doc
    await this.tables.createRow({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritematchesCollectionId,
      rowId: ID.unique(),
      data: {
        UserId: userId,
        Level: level,
        MatchedUsers: [matchedUserId],
        MatchedTopics: commonTopics,
        Participants: [userId, matchedUserId], // ✅ Add participants here
      },
    });
  } else {
    // Update existing
    const doc = userDoc.rows[0];
    await this.tables.updateRow({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritematchesCollectionId,
      rowId: doc.$id,
      data: {
        MatchedUsers: [...new Set([...(doc.MatchedUsers || []), matchedUserId])],
        MatchedTopics: [...new Set([...(doc.MatchedTopics || []), ...commonTopics])],
        Participants: [...new Set([...(doc.Participants || []), userId, matchedUserId])], // ✅ Ensure both users are included
      },
    });
  }
}

  // Create a like and only create a conversation after both users like each other.
async saveLikedMatch(currentUserId: string, matchedUserId: string) {
  try {
    // 1. Get both users
    const currentUser = await this.getUserById(currentUserId);
    const matchedUser = await this.getUserById(matchedUserId);

    if (!currentUser || !matchedUser) {
      throw new Error("One of the users not found");
    }

    // 2. Find common topics
    const commonTopics = this.getCommonTopics(currentUser.Topics, matchedUser.Topics);

    const outgoingLike = await likeService.createOrUpdateLike(currentUserId, matchedUserId);
    const incomingLike = await likeService.getLike(matchedUserId, currentUserId);

    if (!incomingLike || incomingLike.Status === "rejected" || incomingLike.Status === "blocked") {
      await notificationService.sendLikeNotification(currentUserId, matchedUserId);
      return { success: true, matched: false };
    }

    await likeService.updateLikeStatus(outgoingLike.$id, "accepted");
    await likeService.updateLikeStatus(incomingLike.$id, "accepted");
    await this.upsertMatchDoc(currentUserId, currentUser.Level, matchedUserId, commonTopics);
    await this.upsertMatchDoc(matchedUserId, matchedUser.Level, currentUserId, commonTopics);
    await notificationService.sendMatchNotification(currentUserId, matchedUserId);
    await notificationService.sendMatchNotification(matchedUserId, currentUserId);

    return { success: true, matched: true };
  } catch (error) {
    console.error("❌ Error saving match:", error);
    throw error;
  }
}

    // Get the match document that includes both users
    async getMatchBetweenUsers(userId1: string, userId2: string): Promise<MatchDocument | null> {
      try {
        const res = await this.tables.listRows<MatchDocument>({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwritematchesCollectionId,
          queries: [
            Query.contains("Participants", userId1),
            Query.contains("Participants", userId2),
          ],
        });

        return res.rows[0] || null; // returns the match document
      } catch (err) {
        console.error("❌ Error fetching match between users:", err);
        return null;
      }
    }

}

const matchService = new MatchService();
export default matchService;