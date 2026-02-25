import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import matchService from "../../appwrite/matches";
import authService from "../../appwrite/auth";
import ReactNiceAvatar from "react-nice-avatar";

function MessageDashboard() {

  const { userData } = useSelector((state) => state.auth);
  const [getMatchedProfiles, setMatchedProfiles] = useState([]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      if (!userData?.$id) return;
      const profiles = await matchService.getMatchedProfiles(userData.$id, authService);
      console.log("Fetched matched profiles:", profiles);
      setMatchedProfiles(profiles);
    };

    fetchMatches();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex mt-16">

      {/* LEFT — Conversations */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 border-r border-gray-800 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold">Messages</h2>

          {/* Search */}
          <div className="mt-3 flex items-center bg-gray-800 px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="bg-transparent outline-none ml-2 text-sm w-full"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {getMatchedProfiles.length === 0 ? (
          <p className="text-gray-400 text-sm p-3">No conversations yet</p>
        ) : (
          getMatchedProfiles.map((user) => (
            <motion.div
              key={user.$id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800"
            >
              {/* Avatar */}
              {user.Avatar ? (
                <ReactNiceAvatar
                  style={{ width: "64px", height: "64px" }}
                  {...JSON.parse(user.Avatar)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700" />
              )}

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.Name}</p>
                <p className="text-sm">
                  <span
                    className={`${
                      user?.Status === "online"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {user?.Status || "Status not set"}
                  </span>
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Start conversation…
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
      </motion.div>

      {/* RIGHT — Chat area */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center"
      >
        {/* Empty state */}
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Select a conversation</p>
          <p className="text-gray-400 text-sm">
            Choose a user to start messaging
          </p>
        </div>
      </motion.div>

    </div>
  );
}

export default MessageDashboard;