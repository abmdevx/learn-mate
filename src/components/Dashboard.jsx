import { User, BookOpen, Clock, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import authService from "../appwrite/auth";
import matchService from "../appwrite/matches";
import ReactNiceAvatar from "react-nice-avatar";

export default function Dashboard() {
  const { userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(() => {
    if (!userData?.$id) return {};

    try {
      return JSON.parse(sessionStorage.getItem(`profile-${userData.$id}`)) || {};
    } catch {
      return {};
    }
  });
  const [profileError, setProfileError] = useState(false);
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
      try {
        const res = await authService.getProfile(userData.$id);
        setProfile(res);
        sessionStorage.setItem(`profile-${userData.$id}`, JSON.stringify(res));
        authService.updateProfile(userData.$id, { Status: "online" }).catch((error) => {
          console.error("Failed to update online status:", error);
        });
      } catch (error) {
        console.error("Failed to load dashboard profile:", error);
        setProfileError(true);
        setProfile({});
      }
    };

    fetchProfile();
  }, [userData]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-500 text-sm mb-1">Dashboard</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back{profile?.Name ? `, ${profile.Name.split(" ")[0]}` : ""}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-sm text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                <User className="h-3.5 w-3.5" />
                {profile?.Level || "Beginner"}
              </span>
            </div>
            {profileError && (
              <p className="mt-3 text-sm text-yellow-300">
                Some profile details could not be loaded. You can still use your dashboard.
              </p>
            )}
          </div>

          {/* Stat rail */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pb-8 mb-10 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <BookOpen className="text-pink-400 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Topics</p>
                <p className="font-medium">{profile?.Topics?.join(", ") || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-400 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Availability</p>
                <p className="font-medium">{profile?.Availability || "Flexible"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-green-400 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Matches</p>
                <p className="font-medium">{MatchedProfiles.length}</p>
              </div>
            </div>
          </div>

          {/* Matches + CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <Users className="text-green-400 h-5 w-5" />
                <h2 className="text-lg font-semibold">Your matches</h2>
              </div>

              {MatchedProfiles.length === 0 ? (
                <div className="border border-dashed border-gray-700 rounded-xl p-10 text-center">
                  <p className="text-gray-300">You don't have any matches yet.</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Find your match to start learning together.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {MatchedProfiles.map((match) => (
                    <button
                      key={match.$id}
                      onClick={() => setSelectedUser(match)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="relative">
                        {match.Avatar ? (
                          <ReactNiceAvatar
                            style={{ width: "56px", height: "56px" }}
                            {...JSON.parse(match.Avatar)}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-lg font-semibold">
                            {match.Name?.[0]}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                            match.Status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <p className="text-sm font-medium text-center truncate w-full">
                        {match.Name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA panel */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 via-gray-800 to-gray-800 border border-blue-500/20 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to connect and learn?</h3>
                <p className="text-gray-400 text-sm">
                  Find learning partners tailored to your topics and level.
                </p>
              </div>
              <button
                onClick={() => navigate("/match")}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-medium transition-colors"
              >
                Find your match
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Match detail modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-xs p-6 relative flex flex-col items-center text-center"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
              onClick={() => setSelectedUser(null)}
            >
              <X className="h-4 w-4" />
            </button>

            {selectedUser.Avatar ? (
              <ReactNiceAvatar
                style={{ width: "72px", height: "72px" }}
                {...JSON.parse(selectedUser.Avatar)}
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-gray-700 flex items-center justify-center text-xl font-semibold">
                {selectedUser.Name?.[0]}
              </div>
            )}

            <h4 className="mt-4 text-lg font-semibold">{selectedUser.Name}</h4>
            <p className="text-gray-400 text-sm mt-0.5">
              {selectedUser.Level || "Level not set"}
            </p>

            <div className="flex flex-col gap-2 mt-5 w-full text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedUser?.Status === "online" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={
                    selectedUser?.Status === "online" ? "text-green-400" : "text-red-400"
                  }
                >
                  {selectedUser?.Status || "Status not set"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{selectedUser.Timezone || "Timezone not set"}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-green-500 hover:bg-green-400 rounded-xl py-2.5 font-medium transition-colors"
              onClick={() => navigate(`/messages/${selectedUser.$id}`)}
            >
              Message {selectedUser.Name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}