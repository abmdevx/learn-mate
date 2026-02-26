// messages.js
import conf from "../config/ConfigID";
import { Client, ID, TablesDB, Query } from "appwrite";

class MessageService {
  client = new Client();
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  resetClient() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
    console.log("🔄 Appwrite client has been reset.");
  }

  // ✅ Send a new message
  async sendMessage({ matchId, senderId, message }) {
    try {
      const newMessage = await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritemessagesCollectionId, // your messages tableId
        rowId: ID.unique(),
        data: {
          MatchId: matchId,
          SenderId: senderId,
          Message: message,
        },
      });
      return newMessage;
    } catch (error) {
      if (error.message.includes("Rate limit")) this.resetClient();
      console.error("❌ Error sending message:", error);
      throw error;
    }
  }

  // ✅ Get messages of a match (conversation)
  async getMessages(matchId) {
    try {
      const response = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritemessagesCollectionId,
        queries: [
          Query.equal("MatchId", matchId),
          Query.orderAsc("$createdAt"), // order by time ascending
        ],
      });
      return response.rows;
    } catch (error) {
      if (error.message.includes("Rate limit")) this.resetClient();
      console.error("❌ Error fetching messages:", error);
      throw error;
    }
  }

  // ✅ Get all messages sent by a user (optional)
  async getMessagesByUser(userId) {
    try {
      const response = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritemessagesCollectionId,
        queries: [Query.equal("SenderId", userId)],
      });
      return response.rows;
    } catch (error) {
      if (error.message.includes("Rate limit")) this.resetClient();
      console.error("❌ Error fetching messages by user:", error);
      throw error;
    }
  }

  // ✅ Optional: Delete a message
  async deleteMessage(messageId) {
    try {
      return await this.tables.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritemessagesCollectionId,
        rowId: messageId,
      });
    } catch (error) {
      if (error.message.includes("Rate limit")) this.resetClient();
      console.error("❌ Error deleting message:", error);
      throw error;
    }
  }

  subscribeToMessages(matchId, callback) {
    const channel = `databases.${conf.appwriteDatabaseId}.tables.${conf.appwritemessagesCollectionId}.rows`;

    const unsubscribe = this.client.subscribe(channel, (response) => {
      // only listen to new message creation
      if (!response.events.some(e => e.includes(".create"))) return;

      const newMessage = response.payload;

      // important → correct field name
      if (newMessage.MatchId !== matchId) return;

      callback(newMessage);
    });

    return unsubscribe;
  }
}

const messageService = new MessageService();
export default messageService;