import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useFormContext } from "react-hook-form";
import InputField from "../Shared/InputField";
import { useState } from "react";
import Toast from "../Shared/Toast";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";

const SignupStep1 = ({ nextStep }) => {
  const { register, trigger , formState: { errors } , getValues } = useFormContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // <-- add this

  const handleNext = async () => {
    const isValid = await trigger(["Name", "Email", "Password"]);
    if (!isValid) {
      const firstError =
        errors.Name?.message ||
        errors.Email?.message ||
        errors.Password?.message ||
        "Please fill all required fields correctly.";

      setToastMessage(firstError);
      setShowToast(true);
      return;
    }

  try {
      const username = getValues("Name");

      const exists = await authService.checkUsernameExists(username);
      if (exists.username) {
      setToastMessage("Username already exists. Please choose another username.");
      setShowToast(true);
      return;
    }
    } catch (err) {
        setToastMessage(err.message || "Error checking email");
        setShowToast(true);
      return;
    }

    nextStep();

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-xl p-6 border border-orange-500"
      >
        <div className="flex items-center justify-center mb-5">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="h-5 w-5 text-gray-900" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-orange-500 mb-1">
          Create Account ✨
        </h2>
        <p className="text-center text-white mb-6 text-sm">
          Sign up to connect with your learning partner.
        </p>

        <div className="flex flex-col gap-5">
         <InputField
            type="text"
            placeholder="Username"
            {...register("Name", {
              required: "Username is required",
              setValueAs: (value) => value.trim(),
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 30,
                message: "Username must be 30 characters or fewer",
              },
            })}
          />

          <InputField
            type="email"
            placeholder="Email"
            {...register("Email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email address must be valid",
              },
            })}
          />

          <InputField
            placeholder="Password"
            isPassword
            {...register("Password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must include at least 1 letter, 1 number, and 1 special character",
              },
            })}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all text-sm"
            onClick={handleNext}
            type="button"
          >
            Next →
          </motion.button>
        </div>

        <div className="flex justify-center gap-1 mt-3 text-sm">
          <p className="text-white">Already have an account?</p>
          <Link
            to={"/auth/login"}
            className="text-orange-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </motion.div>

      <Toast
        show={showToast}
        message={toastMessage}   // dynamic message now
        onClose={() => setShowToast(false)}
      />

    </div>
  );
};

export default SignupStep1;