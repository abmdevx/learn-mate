import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";
import InputField from "../components/Shared/InputField";
import Toast from "../components/Shared/Toast";
import { Link } from "react-router-dom";

const ForgotPassword = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error"); // 👈 new state for type

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setToastMessage("Email is required");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastMessage("Enter a valid email address");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // ✅ callback to parent if provided
    if (onSubmit) onSubmit(email);

    setToastMessage("Reset link sent to your email ✉️");
    setToastType("success");
    setShowToast(true);
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

        <h2 className="text-xl font-bold text-center text-orange-500 mb-1">
          Forgot Password 🔒
        </h2>
        <p className="text-center text-white mb-6 text-sm">
          Enter your registered email to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all text-sm"
            type="submit"
          >
            Send Reset Link →
          </motion.button>
        </form>

        <div className="flex justify-center gap-1 mt-3 text-sm">
          <p className="text-white">Remembered your password?</p>
          <Link
            to={"/auth/login"}
            className="text-orange-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Toast for messages */}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}        // 👈 pass type dynamically
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ForgotPassword;