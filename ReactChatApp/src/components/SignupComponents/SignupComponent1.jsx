import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useFormContext } from "react-hook-form";
import InputField from "../Shared/InputField";
import { useState } from "react";
import Toast from "../Shared/Toast";

const SignupStep1 = ({ nextStep }) => {
  const { register, trigger , formState: { errors } } = useFormContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // <-- add this

  const handleNext = async () => {
    const isValid = await trigger(["Name", "Email", "Password"]); // validate only these fields
    if (isValid) {
      nextStep();
    }
    else {
      // get the first validation error
      const firstError =
      errors.Name?.message ||
      errors.Email?.message ||
      errors.Password?.message ||
      "Please fill all required fields correctly.";

      setToastMessage(firstError);  // store dynamic message here
      setShowToast(true);
    }
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
              pattern: {
                value: /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]{7,19}$/, // total 8–20
                message:
                  "Username must start with a letter and can contain letters, numbers, and underscores (8–20 characters).",
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
          <a
            href="/login"
            className="text-orange-400 font-semibold hover:underline"
          >
            Login
          </a>
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