import { motion } from "framer-motion";
import { useFormContext, Controller } from "react-hook-form";
import TagsInput from "../Shared/TagsInput";
import Toast from "../Shared/Toast";
import { useState } from "react";

const SignupStep2 = ({ nextStep, prevStep }) => {

  const { register, watch, control } = useFormContext(); // ✅ get from RHF
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const topics = watch("Topics");
  const level = watch("Level");

   const handleNext = () => {
    if (!topics || topics.length < 3) {
      setToast({
        show: true,
        message: "Please add at least 3 skills",
        type: "error",
      });      
      return false; // prevent moving to next step
    }

    if (!level) {
      setToast({ show: true, message: "Please select a level", type: "error" });
      return false;
    }
    
    nextStep(); // move to next step if validation passes
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-800/90 shadow-2xl rounded-xl p-6 border border-orange-500"
      >
        <h2 className="text-lg font-bold text-orange-500 text-center mb-4">
          Step 2: Topics & Level
        </h2>
        <div className="flex flex-col gap-5">
          <Controller
            control={control}
            name="Topics"
            defaultValue={[]}
            render={({ field }) => (
              <TagsInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Add topics"
              />
            )}
          />

          <select
            name="Level"
            {...control.register("Level")}
            className="px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none text-sm"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>

          <div className="flex justify-between">
            <button 
            type="button" 
            onClick={prevStep} 
            className="text-white">
              ← Back
            </button>
            <motion.button 
            type="button" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="py-2 px-4 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md">
              Next →
            </motion.button>
          </div>
        </div>
      </motion.div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default SignupStep2;