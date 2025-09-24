import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
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

  // --- Loader skeleton ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white px-6">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-800 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
          <div className="mb-6 bg-gray-700/60 p-5 rounded-xl">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="h-8 bg-gray-700 rounded w-32 mx-auto mt-4"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-800">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          🔎 Find Your Match
        </h1>

        {/* --- Show user info first --- */}
        {profile && (
          <div className="mb-6 bg-gray-700 p-5 rounded-xl shadow-inner">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              Your Profile
            </h2>
            <p className="text-white">
              <span className="font-bold text-orange-600 mr-1">Level:</span>{" "}
              {profile.Level || "Not set"}
            </p>
            <p className="text-white text-sm mt-2">
              <span className="font-bold text-orange-600 mr-1">Skills:</span>{" "}
              {profile.Topics?.join(", ") || "No skills added"}
            </p>

            {/* Edit button */}
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition mx-auto"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
        )}

        {/* --- Start button --- */}
        <button
          onClick={() => navigate("/find-match")}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-lg font-medium shadow-lg transition w-full"
        >
          Start Finding Your Match 🚀
        </button>
      </div>
    </div>
  );
}