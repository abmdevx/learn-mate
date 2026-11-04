const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionId: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    appwritemessagesCollectionId: String(import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID),
    appwritematchesCollectionId: String(import.meta.env.VITE_APPWRITE_MATCHES_COLLECTION_ID),
    appwritenotificationsCollectionId: String(import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID),
};

export default conf;