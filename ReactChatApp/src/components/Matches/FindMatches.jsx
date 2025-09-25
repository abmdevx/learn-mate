import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import matchService from "../../appwrite/matches";
import { useSelector } from "react-redux";
import ReactNiceAvatar from "react-nice-avatar";
import authService from "../../appwrite/auth";

export default function FindMatchPage() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [profile, setProfile] = useState(null);

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-2xl font-bold text-white mb-6">
          🔎 Finding Your Matches
        </h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {matches.map((m) => (
            <motion.div
              key={m.$id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 p-8 rounded-xl flex flex-col items-center border-4 border-orange-500"
            >
              {m?.Avatar ? (
                <ReactNiceAvatar
                  style={{ width: "100px", height: "100px" }}
                  {...JSON.parse(m.Avatar)}
                />
              ) : (
                <div className="h-10 w-10 bg-green-400 rounded-full mb-2" />
              )}
              <h2 className="text-xl font-semibold mt-2 text-white">{m.Name}</h2>
              <p className="text-orange-500 font-bold">
                Email: <span className="text-white">{m.Email}</span>
              </p>
              <p className="text-orange-500 font-bold">
                Level: <span className="text-white">{m.Level}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-orange-600 font-bold">
                Matched Topics: {""}
                {m.Topics
                  ?.filter((topic) =>
                    profile.Topics?.some(
                      (userTopic) => userTopic.toLowerCase() === topic.toLowerCase()
                    )
                  )
                  .map((matchedTopic, index) => (
                    <span
                      key={index}
                      className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white"
                    >
                      {matchedTopic}
                    </span>
                  )) || <p className="text-gray-400">No matched topics</p>}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleLike(m.$id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <ThumbsUp size={18} /> Like
                </button>
                <button
                  onClick={() => handleDislike(m.$id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  <ThumbsDown size={18} /> Skip
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && hasSearched && matches.length === 0 && !error && (
          <p className="text-gray-400 mt-4">No matches found. 🔄 Try again.</p>
        )}
      </motion.div>
    </div>
  );
}