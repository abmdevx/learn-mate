import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Send } from "lucide-react";
import { useSelector } from "react-redux";
import matchService from "../../appwrite/matches";
import authService from "../../appwrite/auth";
import messageService from "../../appwrite/messages"; // <-- import your messages service
import ReactNiceAvatar from "react-nice-avatar";
import { useParams, useNavigate } from "react-router-dom";

function MessageDashboard() {
  const { userId } = useParams();
  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [getMatchedProfiles, setMatchedProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch matched profiles
  useEffect(() => {
    const fetchMatches = async () => {
      if (!userData?.$id) return;
      const profiles = await matchService.getMatchedProfiles(userData.$id, authService);
      setMatchedProfiles(profiles);

      // If URL has userId param, set selected user
      if (userId) {
        const user = profiles.find((u) => u.$id === userId);
        if (user) setSelectedUser(user);
      }
    };
    fetchMatches();
  }, [userData, userId]);

  // Fetch messages for selected user
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!selectedUser || !userData?.$id) return;

  //     const match = await matchService.getMatchBetweenUsers(
  //       userData.$id,
  //       selectedUser.$id
  //     );
      
  //     if (!match) return;

  //     try {
  //       const msgs = await messageService.getMessages(match.$id);
  //       setMessages(msgs);
  //       scrollToBottom();
  //     } catch (err) {
  //       console.error("Failed to fetch messages:", err);
  //     }
  //   };
  //   fetchMessages();
  // }, [selectedUser, userData, getMatchedProfiles]);

useEffect(() => {
  if (!selectedUser || !userData?.$id) return;

  let unsubscribe;

  const setupChat = async () => {
    try {
      // ✅ get match
      const match = await matchService.getMatchBetweenUsers(
        userData.$id,
        selectedUser.$id
      );

      if (!match) return;

      // ✅ initial messages
      const msgs = await messageService.getMessages(match.$id);
      setMessages(msgs);
      scrollToBottom();

      // ✅ realtime subscription
      unsubscribe = messageService.subscribeToMessages(match.$id, (newMessage) => {
        setMessages((prev) => {
          // prevent duplicates
          if (prev.some(m => m.$id === newMessage.$id)) return prev;
          return [...prev, newMessage];
        });

        scrollToBottom();
      });

    } catch (err) {
      console.error("Realtime setup failed:", err);
    }
  };

  setupChat();

  return () => {
    if (unsubscribe) unsubscribe();
  };

}, [selectedUser, userData]);

  // Handle send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {

      // ✅ get real match
      const match = await matchService.getMatchBetweenUsers(
        userData.$id,
        selectedUser.$id
      );

      const msg = await messageService.sendMessage({
        matchId: match.$id,
        senderId: userData.$id,
        message: newMessage,
      });

      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex mt-16">

      {/* LEFT — Conversations */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-80 border-r border-gray-800 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center bg-gray-800 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="bg-transparent outline-none ml-2 text-sm w-full"
            placeholder="Search conversations..."
          />
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
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 ${
                  selectedUser?._id === user._id ? "bg-gray-800" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  navigate(`/messages/${user.$id}`);
                }}
              >
                {user.Avatar ? (
                  <ReactNiceAvatar
                    style={{ width: "48px", height: "48px" }}
                    {...JSON.parse(user.Avatar)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700" />
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.Name}</p>
                  <p className="text-sm">
                    <span
                      className={`${
                        user?.Status === "online" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {user?.Status || "offline"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {messages.find((m) => m.SenderId === user.$id)?.Message || "Start conversation…"}
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
        className={`flex-1 flex flex-col ${selectedUser ? "block" : "hidden md:block"}`}
      >
        {selectedUser ? (
          <div className="flex-1 flex flex-col p-4">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-3">
              {selectedUser.Avatar ? (
                <ReactNiceAvatar
                  style={{ width: "48px", height: "48px" }}
                  {...JSON.parse(selectedUser.Avatar)}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700" />
              )}
              <div>
                <p className="text-sm font-medium">{selectedUser.Name}</p>
                <span
                  className={`text-xs ${
                    selectedUser.Status === "online" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {selectedUser.Status || "offline"}
                </span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-10">
                  No messages yet. Start chatting!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.$id}
                    className={`flex ${
                      msg.SenderId === userData.$id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                        msg.SenderId === userData.$id ? "bg-blue-500 text-white" : "bg-gray-800"
                      }`}
                    >
                      {msg.Message}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="mt-auto flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedUser.Name}`}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-xl font-semibold mb-2">Select a conversation</p>
            <p className="text-gray-400 text-sm">
              Choose a user to start messaging
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default MessageDashboard;