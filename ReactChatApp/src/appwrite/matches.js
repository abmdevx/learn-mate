import conf from "../config/ConfigID";
import { Client, TablesDB, Query } from "appwrite";

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

  // 💾 2) Save liked match (updates both users' MatchedUsers lists)
  async saveLikedMatch(currentUserId, matchedUserId) {
    try {
      // Get both users
      const currentUser = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: currentUserId,
      });
      const matchedUser = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: matchedUserId,
      });

      if (!currentUser || !matchedUser) {
        throw new Error("One of the users not found");
      }

      // Update current user row
      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: currentUserId,
        data: {
          MatchedUsers: [...(currentUser.MatchedUsers || []), matchedUserId],
        },
      });

      // Update matched user row
      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: matchedUserId,
        data: {
          MatchedUsers: [...(matchedUser.MatchedUsers || []), currentUserId],
        },
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Error saving match:", error);
      throw error;
    }
  }
}

const matchService = new MatchService();
export default matchService;