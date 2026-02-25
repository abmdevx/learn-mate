import { User, BookOpen, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import authService from "../appwrite/auth";
import matchService from "../appwrite/matches";
import ReactNiceAvatar from "react-nice-avatar";

export default function Dashboard() {
  const { userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [MatchedProfiles, setMatchedProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userData?.$id) return;
      const profiles = await matchService.getMatchedProfiles(userData.$id, authService);
      console.log("Fetched matched profiles:", profiles);
      setMatchedProfiles(profiles);
    };

    fetchMatches();
  }, [userData]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) return;
      const res = await authService.getProfile(userData.$id);
      console.log(res);
      console.log(userData);
      setProfile(res);
    };

    fetchProfile();
  }, [userData]);

  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col gap-3"
              >
                <div className="h-5 w-1/3 bg-gray-700 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <div className="h-5 w-1/4 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/3 bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
            </div>
            <div className="h-10 w-40 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col px-6 pt-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-20">
        <div className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <User className="text-blue-400 h-6 w-6" />
            <p className="text-gray-400 text-sm">Your Level</p>
          </div>
          <p className="text-xl font-semibold">{profile?.Level || "Beginner"}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <BookOpen className="text-pink-400 h-6 w-6" />
            <p className="text-gray-400 text-sm">Topics</p>
          </div>
          <p className="text-xl font-semibold">{profile?.Topics?.join(", ") || "Not set"}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-400 h-6 w-6" />
            <p className="text-gray-400 text-sm">Availability</p>
          </div>
          <p className="text-xl font-semibold">{profile?.Availability || "Flexible"}</p>
        </div>
      </div>

      {/* Matches Section */}
    <div className="bg-gray-800 p-6 rounded-2xl shadow mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-green-400 h-6 w-6" />
          <h3 className="text-lg font-semibold">Your Matches</h3>
        </div>

      {MatchedProfiles.length === 0 ? (
        <p className="text-gray-400">
          You don’t have any matches yet. Click{" "}
          <span className="text-blue-400">Find Your Match</span> to start.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {MatchedProfiles.map((match) => (
            <div
              key={match.$id}
              className="flex flex-col items-center w-20 cursor-pointer"
              onClick={() => setSelectedUser(match)}
            >
              {match.Avatar ? (
                <ReactNiceAvatar
                  style={{ width: "64px", height: "64px" }}
                  {...JSON.parse(match.Avatar)}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold">
                  {match.Name?.[0]}
                </div>
              )}
              <p className="mt-2 text-sm font-medium text-center truncate">
                {match.Name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    {selectedUser && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-72 relative flex flex-col items-center text-center">
      {/* Close */}
      <button
        className="absolute top-2 right-2 text-gray-400"
        onClick={() => setSelectedUser(null)}
      >
        ✕
      </button>

      {/* Avatar */}
          {selectedUser.Avatar ? (
            <ReactNiceAvatar
              style={{ width: "72px", height: "72px" }}
              {...JSON.parse(selectedUser.Avatar)}
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold">
              {selectedUser.Name?.[0]}
            </div>
          )}

          {/* Info */}
          <h4 className="mt-3 text-lg font-semibold">{selectedUser.Name}</h4>

          <p className="text-gray-400 text-sm">
            Email: {" "}{selectedUser.Email || "Department not set"}
          </p>

          <p className="text-gray-400 text-sm">
            Level: {" "}{selectedUser.Level || "Level not set"}
          </p>

          <p className="text-gray-400 text-sm">
            Status: {" "}{selectedUser.Status || "Level not set"}
          </p>

          <p className="text-gray-400 text-sm">
            Timezone: {" "}{selectedUser.Timezone || "Level not set"}
          </p>

          <button className="mt-4 w-full bg-green-500 rounded-lg py-2">
            Message {selectedUser.Name}
          </button>
        </div>
      </div>
    )}

      {/* CTA Section */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Ready to connect and learn?</h2>
          <p className="text-gray-400">Find learning partners tailored to your topics and level.</p>
        </div>
        <button 
        onClick={() => navigate("/match")}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-lg font-medium shadow-lg transition">
          Find Your Match 🚀
        </button>
      </div>
      </motion.div>
    </div>
  );
}