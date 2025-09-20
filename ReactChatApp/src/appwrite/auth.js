import conf from "../config/ConfigID";
import { Client, Account, ID, Tables } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Appwrite Endpoint
      .setProject(conf.appwriteProjectId); // Project ID

    this.account = new Account(this.client);
    this.tables = new Tables(this.client);
  }

  resetClient() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.tables = new Tables(this.client);

    console.log("🔄 Appwrite client has been reset.");
  }

  // ✅ Create new user
  async createAccount({ email, password, name, level, availability, timezone, topics, bio }) {
    try {
      const userId = ID.unique();

      // 1️⃣ Create user in Appwrite Auth
      const userAccount = await this.account.create(userId, email, password, name);

      if (userAccount) {
        // 2️⃣ Create session immediately
        await this.account.createEmailPasswordSession({email, password});

        // 3️⃣ Insert row in Users table with same ID
        await this.tables.createRow({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwriteUsersCollectionId, // now this is a TABLE, not legacy collection
          rowId: userId, // use same ID as Auth user
          data: {
            Name: name,
            Email: email,
            Level: level || "Beginner",
            Availability: availability || "Available",
            Timezone: timezone || "UTC",
            Topics: topics || [],
            Bio: bio || "",
            Status: "active",
          },
        });

        // 4️⃣ Fetch user details
        const currentUser = await this.account.get();
        return currentUser;
      } else {
        return null;
      }
    } catch (error) {
      if (error.message.includes("Rate limit")) {
        this.resetClient();
      }
      console.error("❌ Error creating account:", error);
      throw error;
    }
  }

  // ✅ Login
  async login({ email, password }) {
    try {
      await this.account.createEmailPasswordSession({email, password});
      return await this.account.get();
    } catch (error) {
      console.error("❌ Error logging in:", error);
      throw error;
    }
  }

  // ✅ Get current user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("❌ Error getting current user:", error);
      throw error;
    }
  }

  // ✅ Logout
  async logout() {
    try {
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("❌ Error logging out:", error);
      throw error;
    }
  }

  // ✅ Delete account
  async deleteAccount() {
    try {
      await this.account.delete();
      return true;
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;