import { useParams } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useEffect, useState } from "react";
import ReactNiceAvatar from "react-nice-avatar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { ThumbsUp } from "lucide-react";
import matchService from "../../appwrite/matches";
import Toast from "../Shared/Toast";

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const { userData } = useSelector((state) => state.auth); // this has only Appwrite account info

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      // Fetch other user's profile
      const other = await authService.getProfile(id);
      setProfile(other);

      // Fetch logged-in user's *custom* profile
      if (userData?.$id) {
        const self = await authService.getProfile(userData.$id);
        setCurrentProfile(self);
      }
    };
    fetchProfiles();
  }, [id, userData]);

  const handleLike = async (matchId) => {
    try {
      const currentUserId = userData.$id;
      console.log("Saving match:", currentUserId, matchId);
      await matchService.saveLikedMatch(currentUserId, matchId);

      setToast({
        show: true,
        message: "Match saved successfully!",
        type: "success",
      });

    } catch (error) {
      setToast({
        show: true,
        message: "Failed to save match.",
        type: "error",
      });
      console.error("❌ Error saving match:", error.message || error);
      throw error;
    }
  };

    if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="flex items-center gap-6 mb-8 justify-center animate-pulse">
          <div className="w-[120px] h-[120px] bg-gray-700 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-6 w-40 bg-gray-700 rounded"></div>
            <div className="h-4 w-64 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="h-5 w-32 bg-gray-700 rounded mb-2"></div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-20 bg-gray-700 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profileTopics = Array.isArray(profile.Topics)
    ? profile.Topics
    : JSON.parse(profile.Topics || "[]");

  const currentTopics = Array.isArray(currentProfile?.Topics)
    ? currentProfile.Topics
    : JSON.parse(currentProfile?.Topics || "[]");

  const matchedTopics =
    profileTopics.filter((topic) =>
      currentTopics.some(
        (t) => t.trim().toLowerCase() === topic.trim().toLowerCase()
      )
    ) || [];

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    {/* 🔸 Avatar + Name Animation */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-6 mb-8 justify-center mt-15"
    >
      {profile?.Avatar && (
        <ReactNiceAvatar
          style={{ width: "120px", height: "120px" }}
          {...JSON.parse(profile.Avatar)}
        />
      )}
      <div>
        <h1 className="text-3xl font-bold text-orange-500">{profile.Name}</h1>
      </div>
    </motion.div>

    {/* 🔸 Matched Topics Animation */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }} // small delay for smooth sequence
      className="flex flex-col items-center gap-3"
    >
      <h2 className="text-lg font-semibold text-orange-500">
        Matched Topics
      </h2>
      <motion.div
        className="flex flex-wrap gap-2 justify-center"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.05, // 🔹 each topic animates slightly after the previous
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {matchedTopics.length > 0 ? (
          matchedTopics.map((t, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white"
            >
              {t}
            </motion.span>
          ))
        ) : (
          <p className="text-gray-400">No matched topics</p>
        )}
      </motion.div>
      {/* Like Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => handleLike(profile.$id)}
        className="flex items-center gap-2 px-5 py-2.5 mt-4 rounded-full 
        bg-gradient-to-r from-green-500 to-green-600 
        hover:from-green-600 hover:to-green-700 
        shadow-lg shadow-green-500/30 
        transition text-white font-semibold"
      >
        <ThumbsUp size={20} className="text-white" />
        Like
      </motion.button>
    </motion.div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
  </div>
  );
};

export default UserProfile;