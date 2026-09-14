import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import InputField from "../components/Shared/InputField";
import Toast from "../components/Shared/Toast";
import authService from "../appwrite/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check recovery URL
    if (!userId || !secret) {
      setToastMessage(
        "Invalid or expired password reset link."
      );
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check password
    if (!password) {
      setToastMessage("Password is required");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check password length
    if (password.length < 8) {
      setToastMessage(
        "Password must be at least 8 characters long"
      );
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check confirmation
    if (!confirmPassword) {
      setToastMessage("Please confirm your password");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);

      await authService.updatePasswordRecovery(
        userId,
        secret,
        password
      );

      setToastMessage(
        "Password reset successfully! Redirecting to login..."
      );
      setToastType("success");
      setShowToast(true);

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      console.error("Password reset error:", error);

      setToastMessage(
        error?.message || "Failed to reset password"
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-xl p-6 border border-orange-500"
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <LockKeyhole className="h-5 w-5 text-gray-900" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-orange-500 mb-1">
          Reset Password 🔐
        </h2>

        <p className="text-center text-white mb-6 text-sm">
          Enter your new password below.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <InputField
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword
          />

          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            isPassword
          />

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full py-2.5 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password →"}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="flex justify-center gap-1 mt-3 text-sm">
          <p className="text-white">
            Remembered your password?
          </p>

          <Link
            to="/auth/login"
            className="text-orange-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Toast */}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ResetPassword;