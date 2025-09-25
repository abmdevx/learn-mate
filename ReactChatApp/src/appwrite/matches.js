import conf from "../config/ConfigID";
import { Client, TablesDB, Query, ID } from "appwrite";

export class MatchService {
  client = new Client();
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  // 🔍 1) Find a potential match (does not save)
  // 🔍 1) Find and rank all potential matches
  async findMatch(currentUserId) {
    try {
      // Get current user's profile (row)
      const user = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: currentUserId,
      });

      if (!user) return [];

      // Search for other users excluding self
      const matches = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        queries: [
          Query.notEqual("$id", currentUserId),
        ],
      });

      if (matches.total === 0) return [];

      // 🧮 Score function
      const calcScore = (candidate) => {
        let score = 0;

        // Shared topics/skills
        const sharedTopics = candidate.Topics?.filter((t) =>
          user.Topics?.some(ut => ut.toLowerCase() === t.toLowerCase())
        ) || [];

        score += sharedTopics.length * 5;

        // Same level
        if (candidate.Level === user.Level) score += 3;

        return score;
      };

      // Rank candidates
      const ranked = matches.rows.map((c) => ({
        ...c,
        score: calcScore(c),
      }));

      // Sort descending (best → worst)
      ranked.sort((a, b) => b.score - a.score);

      return ranked; // 👈 return all matches
    } catch (error) {
      console.error("❌ Error finding match:", error);
      throw error;
    }
  }

  // Get user by ID
async getUserById(userId) {
  return await this.tables.getRow({
    databaseId: conf.appwriteDatabaseId,
    tableId: conf.appwriteUsersCollectionId,
    rowId: userId,
  });
}

async getMatchDocByUserId(userId) {
    try {
      const res = await this.tables.listRows({
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
  async getMatchedProfiles(userId, authService) {
    try {
      const matchDoc = await this.getMatchDocByUserId(userId);
      if (!matchDoc) return [];

      const matchedIds = matchDoc.MatchedUsers || [];
      if (!matchedIds.length) return [];

      const profiles = await authService.getUsersByIds(matchedIds);
      return profiles;
    } catch (err) {
      console.error("❌ Error fetching matched profiles:", err);
      return [];
    }
  }


// Find common topics (case-insensitive)
getCommonTopics(userTopics = [], matchedTopics = []) {
  const userNormalized = userTopics.map((t) => t.toLowerCase());
  const matchedNormalized = matchedTopics.map((t) => t.toLowerCase());
  return userNormalized.filter((topic) => matchedNormalized.includes(topic));
}

// Create or update match doc for a user
async upsertMatchDoc(userId, level, matchedUserId, commonTopics) {
  let userDoc = await this.tables.listRows({
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
      },
    });
  } else {
    // Update existing
    const doc = userDoc.documents[0];
    await this.tables.updateRow({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritematchesCollectionId,
      rowId: doc.$id,
      data: {
        MatchedUsers: [...new Set([...(doc.MatchedUsers || []), matchedUserId])],
        MatchedTopics: [...new Set([...(doc.MatchedTopics || []), ...commonTopics])],
      },
    });
  }
}

  // 💾 2) Save liked match (updates both users' MatchedUsers lists)
async saveLikedMatch(currentUserId, matchedUserId) {
  try {
    // 1. Get both users
    const currentUser = await this.getUserById(currentUserId);
    const matchedUser = await this.getUserById(matchedUserId);

    if (!currentUser || !matchedUser) {
      throw new Error("One of the users not found");
    }

    // 2. Find common topics
    const commonTopics = this.getCommonTopics(currentUser.Topics, matchedUser.Topics);

    // 3. Update current user's match record
    await this.upsertMatchDoc(currentUserId, currentUser.Level, matchedUserId, commonTopics);
    
    // 4. Update matched user's match record
    await this.upsertMatchDoc(matchedUserId, matchedUser.Level, currentUserId, commonTopics);

    return { success: true };
  } catch (error) {
    console.error("❌ Error saving match:", error);
    throw error;
  }
}

}

const matchService = new MatchService();
export default matchService;