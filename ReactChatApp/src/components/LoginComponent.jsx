import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import InputField from "./Shared/InputField";

const Login = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-2 mt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <div className="bg-gray-800/90 border border-orange-500/60 rounded-2xl p-6 shadow-lg">
          {/* Icon and Heading */}
          <div className="flex flex-col items-center mb-3">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4">
              <LogIn className="text-gray-900" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-orange-500">Welcome Back</h1>
            <p className="text-white mt-1 text-center text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Form Inputs */}
          <form className="flex flex-col gap-4">
            <InputField
              id="email"
              type="email"
              placeholder="Email"
              required
            />
            <InputField
              id="password"
              placeholder="Password"
              required
              isPassword
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-xs text-orange-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-gray-900 bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow"
            >
              Sign In
            </motion.button>
          </form>

          {/* Bottom Link */}
          <div className="flex justify-center gap-1 mt-3 text-sm">
            <p className="text-white">Don't have an account?</p>
            <a
              href="/signup"
              className="text-orange-400 font-semibold hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;