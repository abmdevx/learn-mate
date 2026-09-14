import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import matchService from "../../appwrite/matches"; // your matches/messages API
import authService from "../../appwrite/auth";
import ReactNiceAvatar from "react-nice-avatar";

export default function MessageChat() {
  const navigate = useNavigate();
  const { userId } = useParams(); // route: /messages/:userId
  const { userData } = useSelector((state) => state.auth);

  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  // Fetch chat user info
  useEffect(() => {
    const fetchChatUser = async () => {
      if (!userId) return;
      const profile = await authService.getProfile(userId);
      setChatUser(profile);
    };
    fetchChatUser();
  }, [userId]);

  // Fetch messages with this user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !userData) return;
      const msgs = await matchService.getMessages(userData.$id, userId); // implement API
      setMessages(msgs);
    };
    fetchMessages();
  }, [userId, userData]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const messageObj = {
      senderId: userData.$id,
      receiverId: userId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    // Save message via service
    await matchService.sendMessage(messageObj);
    setMessages((prev) => [...prev, messageObj]);
    setNewMessage("");
  };

  if (!chatUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col flex-1 h-screen bg-gray-900 mt-16"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        <button
          onClick={() => navigate("/messages")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        {chatUser.Avatar ? (
          <ReactNiceAvatar
            style={{ width: 40, height: 40 }}
            {...JSON.parse(chatUser.Avatar)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700" />
        )}
        <div>
          <p className="font-medium text-white">{chatUser.Name}</p>
          <p
            className={`text-xs ${
              chatUser.Status === "online" ? "text-green-500" : "text-red-500"
            }`}
          >
            {chatUser.Status || "offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const isSender = msg.senderId === userData.$id;
          return (
            <div
              key={idx}
              ref={scrollRef}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-xs px-3 py-2 rounded-xl ${
                  isSender ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {msg.message}
                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Input box */}
      <div className="flex items-center p-4 border-t border-gray-800 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
}