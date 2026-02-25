import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import matchService from "../../appwrite/matches";
import { useSelector } from "react-redux";
import ReactNiceAvatar from "react-nice-avatar";
import authService from "../../appwrite/auth";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import

export default function FindMatchPage() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) return;
      const res = await authService.getProfile(userData.$id);
      setProfile(res);
    };

    fetchProfile();
  }, [userData]);

  const handleFindMatch = async () => {
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      await new Promise((r) => setTimeout(r, 1500)); // simulate delay
      const currentUserId = userData.$id;
      const res = await matchService.findMatch(currentUserId);

      if (res.length > 0) {
        setMatches(res);
      } else {
        setError("No suitable match found at the moment.");
      }
    } catch (err) {
      setError("Something went wrong while finding a match.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (matchId) => {
    try {
      const currentUserId = userData.$id;
      console.log("Saving match:", currentUserId, matchId);
      await matchService.saveLikedMatch(currentUserId, matchId);
      alert("✅ Match saved!");
    } catch (error) {
      alert("❌ Failed to save match.");
      console.error("❌ Error saving match:", error.message || error);
      throw error;
    }
  };

  const handleDislike = (matchId) => {
    alert("❌ Skipped match!");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      {/* --- Top Left Go Back Button --- */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/match")}
          className="absolute top-6 left-6 flex items-center gap-2 
                    bg-gray-800/60 border border-gray-700/40 
                    hover:bg-gray-700/60 text-gray-300 
                    px-4 py-2 rounded-xl shadow-md 
                    transition-all duration-200 mt-13"
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center"
      >
        {!loading && matches.length === 0 && !error && (
          <button
            onClick={handleFindMatch}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-medium text-lg shadow-lg transition"
          >
            Find Matches 🚀
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            <p className="text-gray-300 animate-pulse">Searching...</p>
          </div>
        )}

        {error && (
          <p className="text-red-400 mt-4">
            {error}
            <button
              onClick={handleFindMatch}
              className="ml-2 underline text-orange-400"
            >
              Try again
            </button>
          </p>
        )}

        {/* --- Display all matches --- */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-20 md:mt-0 grid-cols-1">
          {matches.map((m) => (
            <motion.div
              key={m.$id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 p-6 rounded-xl flex flex-col items-center cursor-pointer hover:border-orange-400 border-2 border-transparent transition"
              onClick={() => setSelectedMatch(m)}
            >
              {m?.Avatar ? (
                <ReactNiceAvatar
                  style={{ width: "100px", height: "100px" }}
                  {...JSON.parse(m.Avatar)}
                />
              ) : (
                <div className="h-10 w-10 bg-green-400 rounded-full mb-2" />
              )}
              <h2 className="text-lg font-semibold mt-2 text-white">{m.Name}</h2>
            </motion.div>
          ))}
        </div>
        {/* --- Selected Match Modal --- */}
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-8 rounded-xl w-96 relative flex flex-col items-center justify-center gap-2"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              {/* Avatar */}
              {selectedMatch?.Avatar && (
                <ReactNiceAvatar
                  style={{ width: "100px", height: "100px" }}
                  {...JSON.parse(selectedMatch.Avatar)}
                />
              )}

              {/* Name + details */}
              <h2 className="text-xl font-semibold mt-2 text-white">{selectedMatch.Name}</h2>
              <p className="text-orange-500 font-bold">
                Email: <span className="text-white">{selectedMatch.Email}</span>
              </p>
              <p className="text-orange-500 font-bold">
                Level: <span className="text-white">{selectedMatch.Level}</span>
              </p>

              {/* Matched Topics */}
              <div className="flex flex-wrap gap-2 text-orange-600 font-bold">
                Matched Topics:{" "}
                {selectedMatch.Topics?.filter((topic) =>
                  profile.Topics?.some(
                    (userTopic) => userTopic.toLowerCase() === topic.toLowerCase()
                  )
                ).map((t, i) => (
                  <span key={i} className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white">
                    {t}
                  </span>
                )) || <p className="text-gray-400">No matched topics</p>}
              </div>

              {/* Like / Skip buttons */}
              <div className="flex gap-6 mt-6">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleLike(selectedMatch.$id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full 
                        bg-gradient-to-r from-green-500 to-green-600 
                        hover:from-green-600 hover:to-green-700 
                        shadow-lg shadow-green-500/30 
                        transition text-white font-semibold"
            >
              <ThumbsUp size={20} className="text-white" />
              Like
            </motion.button>
          </div>

            </motion.div>
          </motion.div>
        )}

        {!loading && hasSearched && matches.length === 0 && !error && (
          <p className="text-gray-400 mt-4">No matches found. 🔄 Try again.</p>
        )}
      </motion.div>
      {/* --- Try Again Button --- */}
      {hasSearched && !loading && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFindMatch}
          className="mt-8 flex items-center gap-2 bg-gradient-to-r 
                    from-orange-600 to-orange-500 hover:from-orange-500 
                    hover:to-orange-400 px-6 py-3 rounded-xl 
                    font-semibold text-white shadow-lg shadow-orange-600/30 
                    transition"
        >
          <RefreshCw size={18} />
          Not satisfied? Try Again
        </motion.button>
      )}
    </div>
  );
}