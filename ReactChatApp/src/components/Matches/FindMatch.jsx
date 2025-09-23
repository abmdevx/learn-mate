import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, User } from "lucide-react";
import matchService from "../../appwrite/matches";

export default function FindMatch() {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);

  const handleFindMatch = async () => {
    setLoading(true);
    setError(null);
    setMatch(null);

    try {
      // simulate delay for animation
      await new Promise((r) => setTimeout(r, 1500));

      const res = await matchService.findMatch(); // your match logic
      if (res) {
        setMatch(res);
      } else {
        setError("No suitable match found at the moment.");
      }
    } catch (err) {
      setError("Something went wrong while finding a match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/90 p-8 rounded-2xl shadow-lg w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold text-orange-500 mb-4">
          🔎 Find Your Match
        </h1>
        <p className="text-gray-400 mb-6">
          Click the button below to start finding your learning partner.
        </p>

        {!loading && !match && !error && (
          <button
            onClick={handleFindMatch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-lg shadow-lg transition"
          >
            Start Finding Your Match 🚀
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            <p className="text-gray-300 animate-pulse">Finding match...</p>
          </div>
        )}

        {match && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gray-700 p-4 rounded-xl shadow-md flex flex-col items-center"
          >
            <User className="h-10 w-10 text-green-400 mb-2" />
            <h2 className="text-xl font-semibold">{match.Name}</h2>
            <p className="text-gray-400">{match.Email}</p>
            <p className="text-sm text-gray-300 mt-1">
              Level: {match.Level} | Topics: {match.Topics?.join(", ")}
            </p>
          </motion.div>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </motion.div>
    </div>
  );
}