import conf from "../config/ConfigID";
import { Client, TablesDB, Query, ID } from "appwrite";

export class NotificationService {
  client = new Client();
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  // 🧡 1️⃣ Create a new like notification
  async sendLikeNotification(senderId, receiverId) {
    try {
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritenotificationsCollectionId,
        rowId: ID.unique(),
        data: {
          SenderId: senderId,
          ReceiverId: receiverId,
          Status: "pending",
          Read: false,
        },
      });
      return { success: true };
    } catch (err) {
      console.error("❌ Error sending notification:", err);
      throw err;
    }
  }

    async getUnreadCount(userId) {
        try {
            const res = await this.tables.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwritenotificationsCollectionId,
            queries: [
                Query.equal("ReceiverId", [userId]),
                Query.equal("Read", [false]),
            ],
            });
            return res.total;
        } catch (err) {
            console.error("❌ Error fetching unread count:", err);
            return 0;
        }
    }

    async getUserNotifications(userId) {
        try {
            const res = await this.tables.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwritenotificationsCollectionId,
            queries: [
                Query.equal("ReceiverId", [userId]),
                Query.orderDesc("$createdAt"),
            ],
            });

            return res.rows;
        } catch (err) {
            console.error("❌ Error fetching notifications:", err);
            return [];
        }
    }

    async markAllAsRead(userId) {
        try {
            const notifications = await this.tables.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwritenotificationsCollectionId,
            queries: [
                Query.equal("ReceiverId", [userId]),
                Query.equal("Read", [false]),
            ],
            });

            for (const n of notifications.rows) {
            await this.tables.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwritenotificationsCollectionId,
                rowId: n.$id,
                data: { Read: true },
            });
            }

            return { success: true };
        } catch (err) {
            console.error("❌ Error marking notifications as read:", err);
            throw err;
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;