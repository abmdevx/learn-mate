import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import ReactNiceAvatar from "react-nice-avatar";
import { motion } from "framer-motion";
import { RefreshCcwIcon, Pencil } from "lucide-react";
import authService from "../appwrite/auth";
import InputField from "../components/Shared/InputField";
import TagsInput from "../components/Shared/TagsInput";
import Toast from "../components/Shared/Toast"

function Profile() {
  const { userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  // Edit mode toggles
  const [editPersonal, setEditPersonal] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [editTopics, setEditTopics] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // RHF
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) return;
      const res = await authService.getProfile(userData.$id);
      setProfile(res);
      reset(res); // preload data into RHF
    };

    fetchProfile();
  }, [userData, reset]);

  if (!profile) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-20 w-20 bg-gray-700 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Submit handler
  const onSubmit = async (data) => {
    try {
      await authService.updateProfile(profile.$id, data);
      setToast({ show: true, message: "Profile updated successfully!", type: "success" });
      setProfile({ ...profile, ...data });
      setEditPersonal(false);
      setEditBio(false);
      setEditTopics(false);
    } catch (err) {
      console.error("Update failed:", err);
      setToast({ show: true, message: "Profile not updated!", type: "error" });
    }
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen flex flex-col justify-center">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-orange-500">
            {profile.Name}
          </h1>
          <p className="text-gray-400">{profile.Email}</p>
        </div>
      </motion.div>

      {/* Master Update button */}
      <div className="flex justify-center mb-10">
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 , delay: 0.1 }}
          onClick={handleSubmit(onSubmit)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md cursor-pointer"
        >
          <RefreshCcwIcon className="w-5 h-5" />
          Update Profile
        </motion.button>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700 relative"
        >
          <h2 className="text-xl font-semibold mb-4 text-orange-500 flex justify-between items-center">
            Personal Info
            <button
              onClick={() => setEditPersonal(!editPersonal)}
              className="text-gray-400 hover:text-orange-400"
            >
              <Pencil size={18} />
            </button>
          </h2>
          {editPersonal ? (
            <div className="space-y-3">
              <Controller
                name="Level"
                control={control}
                render={({ field }) => (
                  <InputField placeholder="Level" {...field} />
                )}
              />
              <Controller
                name="Availability"
                control={control}
                render={({ field }) => (
                  <InputField placeholder="Availability" {...field} />
                )}
              />
              <Controller
                name="Timezone"
                control={control}
                render={({ field }) => (
                  <InputField
                  className="cursor-not-allowed" 
                  placeholder="Timezone" {...field} disabled />
                )}
              />
              <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                  <InputField
                  className="cursor-not-allowed" 
                  placeholder="Status" {...field} disabled />
                )}
              />
            </div>
          ) : (
            <>
              <p>
                <span className="font-medium">Level:</span> {profile.Level}
              </p>
              <p>
                <span className="font-medium">Availability:</span>{" "}
                {profile.Availability}
              </p>
              <p>
                <span className="font-medium">Timezone:</span>{" "}
                {profile.Timezone}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full ${profile?.Status === "online" ? "text-green-500" : "text-red-600"}`}>
                  {profile?.Status || "offline"}
                </span>
              </p>
            </>
          )}
        </motion.div>

        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700 relative"
        >
          <h2 className="text-xl font-semibold mb-4 text-orange-500 flex justify-between items-center">
            About Me
            <button
              onClick={() => setEditBio(!editBio)}
              className="text-gray-400 hover:text-orange-400"
            >
              <Pencil size={18} />
            </button>
          </h2>
          {editBio ? (
            <Controller
              name="Bio"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white text-sm"
                  placeholder="Write something about yourself..."
                />
              )}
            />
          ) : (
            <p className="text-gray-300">
              {profile.Bio || "No bio provided."}
            </p>
          )}
        </motion.div>

        {/* Topics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700 md:col-span-2 relative"
        >
          <h2 className="text-xl font-semibold mb-4 text-orange-500 flex justify-between items-center">
            Interests / Topics
            <button
              onClick={() => setEditTopics(!editTopics)}
              className="text-gray-400 hover:text-orange-400"
            >
              <Pencil size={18} />
            </button>
          </h2>
          {editTopics ? (
            <Controller
              name="Topics"
              control={control}
              render={({ field }) => (
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add topics..."
                />
              )}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.Topics?.length > 0 ? (
                profile.Topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-indigo-600 px-3 py-1 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No topics added.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default Profile;