import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcwIcon } from "lucide-react";
import Toast from "../components/Shared/Toast";
import InputField from "../components/Shared/InputField";

function Settings() {
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleUpdate = () => {
    setToast({ show: true, message: "Email/Password update functionality coming soon!", type: "info" });
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-orange-500 mb-8"
      >
        Settings
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-800/90 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg"
      >
        <div className="space-y-4">
          <InputField placeholder="Enter New Email" disabled />
          <InputField placeholder="Enter New Password" type="password" disabled />

          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 justify-center w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
          >
            <RefreshCcwIcon className="w-5 h-5" />
            Update
          </button>
        </div>
      </motion.div>

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default Settings;