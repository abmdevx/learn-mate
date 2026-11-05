import conf from "../config/ConfigID";
import { Client, TablesDB, Query, ID } from "appwrite";
import type { Notification } from "../types";

export class NotificationService {
  client = new Client();
  tables: TablesDB;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  // 🧡 1️⃣ Create a new like notification
  async sendLikeNotification(senderId: string, receiverId: string) {
    try {
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritenotificationsCollectionId,
        rowId: ID.unique(),
        data: {
          SenderId: senderId,
          ReceiverId: receiverId,
          Status: "like",
          Read: false,
        },
      });
      return { success: true };
    } catch (err) {
      console.error("❌ Error sending notification:", err);
      throw err;
    }
  }

  async sendMessageNotification(senderId: string, receiverId: string) {
    try {
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritenotificationsCollectionId,
        rowId: ID.unique(),
        data: {
          SenderId: senderId,
          ReceiverId: receiverId,
          Status: "message",
          Read: false,
        },
      });
    } catch (err) {
      console.error("❌ Error sending message notification:", err);
      throw err;
    }
  }

  async sendMatchNotification(senderId: string, receiverId: string) {
    try {
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritenotificationsCollectionId,
        rowId: ID.unique(),
        data: { SenderId: senderId, ReceiverId: receiverId, Status: "match", Read: false },
      });
    } catch (err) {
      console.error("❌ Error sending match notification:", err);
      throw err;
    }
  }

    async getUnreadCount(userId: string): Promise<number> {
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

    async getUserNotifications(userId: string): Promise<Notification[]> {
        try {
            const res = await this.tables.listRows<Notification>({
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

    async markAllAsRead(userId: string) {
        try {
            const notifications = await this.tables.listRows<Notification>({
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

    subscribeToUserNotifications(userId: string, callback: (notification: Notification) => void) {
        const channel = `databases.${conf.appwriteDatabaseId}.tables.${conf.appwritenotificationsCollectionId}.rows`;

        return this.client.subscribe(channel, (response) => {
            if (!response.events.some((event) => event.includes(".create"))) return;
            const notification = response.payload as Notification;
            if (notification.ReceiverId === userId) callback(notification);
        });
    }
}

const notificationService = new NotificationService();
export default notificationService;