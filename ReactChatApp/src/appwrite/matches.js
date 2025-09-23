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
  async findPotentialMatch(userId) {
    try {
      // Get current user's profile
      const user = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: userId,
      });

      if (!user) return null;

      // Search for other users with same topic + level
      const matches = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        queries: [
          Query.equal("Level", user.Level),
          Query.contains("Topics", user.Topics[0]), // example: match by first topic
          Query.notEqual("$id", userId),            // exclude self
        ],
      });

      if (matches.total === 0) return null;

      // Just return the first match (later you can add randomness/scoring)
      return matches.documents[0];

    } catch (error) {
      console.error("❌ Error finding potential match:", error);
      throw error;
    }
  }

  // 💾 2) Save match (updates both users)
  async saveMatch(currentUserId, matchedUserId) {
    try {
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

      // Update both users' MatchedUsers arrays
      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: currentUserId,
        data: {
          MatchedUsers: [...(currentUser.MatchedUsers || []), matchedUserId],
        },
      });

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