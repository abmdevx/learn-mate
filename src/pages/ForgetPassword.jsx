import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import InputField from "../components/Shared/InputField";
import Toast from "../components/Shared/Toast";
import authService from "../appwrite/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate empty email
    if (!email) {
      setToastMessage("Email is required");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setToastMessage("Enter a valid email address");
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);

      // Where Appwrite will redirect the user
      // after they click the reset link in their email.
      const recoveryUrl = `${window.location.origin}/auth/reset-password`;

      await authService.createPasswordRecovery(
        email,
        recoveryUrl
      );

      setToastMessage("Reset link sent to your email ✉️");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Password recovery error:", error);

      setToastMessage(
        error?.message || "Failed to send reset link"
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
            <Mail className="h-5 w-5 text-gray-900" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-orange-500 mb-1">
          Forgot Password 🔒
        </h2>

        <p className="text-center text-white mb-6 text-sm">
          Enter your registered email to reset your password.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full py-2.5 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link →"}
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

export default ForgotPassword;