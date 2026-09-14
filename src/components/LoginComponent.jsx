import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import InputField from "./Shared/InputField";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { loginUser } from "../Redux/AuthThunks";
import Loader from "../Loader";
import { useState , useEffect } from "react";
import authService from "../appwrite/auth";
import Toast from "./Shared/Toast"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false); // ✅ loader state
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0); // countdown in seconds

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const MAX_ATTEMPTS = 3;       // max wrong attempts
  const BLOCK_TIME = 5 * 60;    // 5 minutes in seconds
  const handleLogin = async (data) => {
  if (isBlocked) return;

    try {
      setLoading(true); // ✅ show loader immediately
      const user = await dispatch(loginUser(data)).unwrap();
      console.log("what you have lol?" , user);
      await authService.updateProfile(user.$id, { Status: "online" });
      setFailedAttempts(0);
      // Delay navigation (2.5s = 2500ms)
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 5000);
    } catch (err) {
      setLoading(false);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      const message =
      err === "Rate limit for the current endpoint has been exceeded. Please try again after some time."
      ? "Too many login attempts. Please wait a few minutes and try again."
      : err || "Invalid email or password";
      setToast({ show: true, message, type: "error" });

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setTimer(BLOCK_TIME);
        const unblockTime = Date.now() + BLOCK_TIME * 1000; // timestamp when user can try again
        localStorage.setItem("loginBlockedUntil", unblockTime); // save unblock time
      }
    }
  };

  useEffect(() => {
    const blockedUntil = localStorage.getItem("loginBlockedUntil");
    if (blockedUntil) {
      const remaining = Math.floor((blockedUntil - Date.now()) / 1000);
      if (remaining > 0) {
        setIsBlocked(true);
        setTimer(remaining);
      } else {
        localStorage.removeItem("loginBlockedUntil");
      }
    }
  }, []);


  useEffect(() => {
  if (!isBlocked) return;

  const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBlocked(false);
          setFailedAttempts(0);
          localStorage.removeItem("loginBlockedUntil"); // remove after timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked]);


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-2 mt-8">
      {loading ? (
        <Loader /> // ✅ show loader while waiting
      ) : (
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleLogin)}>
              <InputField
                id="email"
                type="email"
                placeholder="Email"
                required
                {...register('email', {
                  required: true,
                  validate: {
                    pattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />
              <InputField
                id="password"
                placeholder="Password"
                required
                isPassword
                {...register('password', { required: true })}
              />

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to={"/auth/forget-password"}
                  className="text-xs text-orange-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isBlocked || loading}
                className={`w-full py-2.5 rounded-lg font-semibold text-gray-900 
                ${isBlocked || loading ? "bg-gray-600 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"} 
                transition-all duration-300 shadow`}
              >
                {isBlocked ? `Try again in ${timer}s` : "Sign In"}
              </motion.button>
            </form>

            {/* Bottom Link */}
            <div className="flex justify-center gap-1 mt-3 text-sm">
              <p className="text-white">Don't have an account?</p>
              <Link
                to={"/auth/signup"}
                className="text-orange-400 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;