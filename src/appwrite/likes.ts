import { Client, ID, Query, TablesDB, type Models } from "appwrite";
import conf from "../config/ConfigID";

export type LikeStatus = "pending" | "accepted" | "rejected" | "blocked";

export interface LikeDocument extends Models.Row {
  SenderId: string;
  ReceiverId: string;
  Status: LikeStatus;
}

class LikeService {
  client = new Client();
  tables: TablesDB;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.tables = new TablesDB(this.client);
  }

  async getLike(senderId: string, receiverId: string): Promise<LikeDocument | null> {
    const response = await this.tables.listRows<LikeDocument>({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritelikesCollectionId,
      queries: [
        Query.equal("SenderId", senderId),
        Query.equal("ReceiverId", receiverId),
        Query.limit(1),
      ],
    });
    return response.rows[0] || null;
  }

  async getSentLikes(senderId: string): Promise<LikeDocument[]> {
    const response = await this.tables.listRows<LikeDocument>({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritelikesCollectionId,
      queries: [Query.equal("SenderId", senderId)],
    });
    return response.rows;
  }

  async createOrUpdateLike(senderId: string, receiverId: string): Promise<LikeDocument> {
    const existing = await this.getLike(senderId, receiverId);
    if (existing) {
      return this.tables.updateRow<LikeDocument>({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritelikesCollectionId,
        rowId: existing.$id,
        data: { Status: "pending" },
      });
    }

    return this.tables.createRow<LikeDocument>({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritelikesCollectionId,
      rowId: ID.unique(),
      data: { SenderId: senderId, ReceiverId: receiverId, Status: "pending" },
    });
  }

  async updateLikeStatus(likeId: string, status: LikeStatus): Promise<LikeDocument> {
    return this.tables.updateRow<LikeDocument>({
      databaseId: conf.appwriteDatabaseId,
      tableId: conf.appwritelikesCollectionId,
      rowId: likeId,
      data: { Status: status },
    });
  }
}

export default new LikeService();
