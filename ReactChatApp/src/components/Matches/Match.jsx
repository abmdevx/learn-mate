import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import authService from "../../appwrite/auth";

export default function Match() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getProfile(userData.$id);
        setProfile(res);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md border border-gray-700/40 shadow-lg shadow-orange-600/10"
        >
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-700/50 rounded-xl w-2/3 mx-auto"></div>
            <div className="bg-gray-700/30 p-6 rounded-2xl space-y-3">
              <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
              <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
              <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
            </div>
            <div className="h-12 bg-gradient-to-r from-orange-600/30 to-orange-500/30 rounded-xl"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 mt-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block text-5xl mb-3"
          >
            🔎
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Find Your Match</h1>
        </motion.div>

        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-orange-500">Your Profile</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-sm text-gray-300 transition"
              >
                <Edit3 size={14} />
                Edit
              </motion.button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Level</span>
                <p className="text-white font-medium">{profile.Level || "Not set"}</p>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Skills</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.Topics && profile.Topics.length > 0 ? (
                    profile.Topics.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-600/80 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-white font-medium">No skills added</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/find-match")}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-orange-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Start Finding Your Match 🚀
        </motion.button>
      </motion.div>
    </div>
  );
}