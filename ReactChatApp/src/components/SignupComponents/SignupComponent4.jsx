import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const SignupStep4 = ({ prevStep, handleSubmit }) => {
  const { register, watch } = useFormContext();
  const Bio = watch("Bio");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-800/90 shadow-2xl rounded-xl p-6 border border-orange-500"
      >
        <h2 className="text-lg font-bold text-orange-500 text-center mb-4">
          Step 4: Your Bio
        </h2>

        {/* Just inputs — no <form> here */}
        <div className="flex flex-col gap-5">
          <textarea
            placeholder="Write a short Bio about yourself..."
            {...register("Bio")}
            defaultValue={Bio}
            className="px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none text-sm min-h-[100px]"
          />

          <div className="flex justify-between">
            <button type="button" onClick={prevStep} className="text-white">
              ← Back
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit} // parent handles final submit
              className="py-2 px-4 bg-green-500 text-gray-900 rounded-lg font-semibold shadow-md"
            >
              Finish
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupStep4;