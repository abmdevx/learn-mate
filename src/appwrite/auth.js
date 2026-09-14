import conf from "../config/ConfigID";
import { Client, Account, ID, TablesDB, Query } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Appwrite Endpoint
      .setProject(conf.appwriteProjectId); // Project ID

    this.account = new Account(this.client);
    this.tables = new TablesDB(this.client);
  }

  resetClient() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.tables = new TablesDB(this.client);

    console.log("🔄 Appwrite client has been reset.");
  }

  // ✅ Create new user
  async createAccount({ email, password, name, level, availability, timezone, topics, bio, avatar }) {
      try {
        const userId = ID.unique();

        // 1️⃣ Create user in Appwrite Auth
        const userAccount = await this.account.create({ userId, email, password, name });

        if (!userAccount) return null;

        // 2️⃣ Create session immediately
        await this.account.createEmailPasswordSession({ email, password });

        // 3️⃣ Insert row in Users table with its own try-catch
        try {
          await this.tables.createRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteUsersCollectionId,
            rowId: userId,
            data: {
              Name: name,
              Level: level || "Beginner",
              Availability: availability || "Available",
              Timezone: timezone || "UTC",
              Topics: Array.isArray(topics) ? topics : [],
              Bio: bio || "",
              Avatar: avatar ? JSON.stringify(avatar) : "",
              Status: "offline",
            },
          });
        } catch (tableError) {
          console.error("❌ Failed to insert user row:", tableError);
          // Optional: decide if you want to throw or continue
          throw new Error("Failed to create user row in database");
        }

        // 4️⃣ Fetch user details
        const currentUser = await this.account.get();
        return currentUser;

      } catch (error) {
        if (error.code === 409) {
          throw new Error("Email already exists. Please log in.");
        }

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
      await this.account.createEmailPasswordSession({ email, password });
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

  async getProfile(userId) {
    try {
      return await this.tables.getRow({ databaseId: conf.appwriteDatabaseId, tableId: conf.appwriteUsersCollectionId, rowId: userId});
    } catch (error) {
      console.error("❌ Error getting profile:", error);
      throw error;
    }
  }

  async getUsersByIds(userIds = []) {
    const profiles = await Promise.all(userIds.map((id) => this.getProfile(id)));
    return profiles.filter(Boolean); // remove null if any user not found
  }

  async updateProfile(profileId, updates) {
    try {
      const response = await this.tables.updateRow(
        { databaseId: conf.appwriteDatabaseId, tableId: conf.appwriteUsersCollectionId, rowId: profileId, data: updates}
      );
      return response;
    } catch (error) {
      console.error("Appwrite updateProfile error:", error);
      throw error;
    }
  }

  async checkUsernameExists(username) {
    try {
      const response = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        queries: [
          Query.equal("Name", username)
        ],
      });

      const exists = { username: false };

      response.rows.forEach(row => {
        if (row.Name === username) exists.username = true;
      });

      return exists;
    } catch (err) {
      console.error("Check error:", err);
      throw new Error(err.message || "Failed to check email or username");
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

// ✅ Send password recovery email
  async createPasswordRecovery(email, recoveryUrl) {
    try {
      const response = await this.account.createRecovery({
        email,
        url: recoveryUrl,
      });

      return response;
    } catch (error) {
      console.error("❌ Error creating password recovery:", error);
      throw error;
    }
  }

  // ✅ Complete password recovery
  async updatePasswordRecovery(userId, secret, password) {
    try {
      const response = await this.account.updateRecovery({
        userId,
        secret,
        password,
      });

      return response;
    } catch (error) {
      console.error("❌ Error updating password recovery:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;