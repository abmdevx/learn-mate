import { useState } from "react";
import { motion } from "framer-motion";
import { useFormContext, Controller } from "react-hook-form";
import TimezoneSelect from "react-timezone-select";
import Toast from "../Shared/Toast";

const SignupStep3 = ({ nextStep, prevStep }) => {
  const { control, trigger, formState: { errors } } = useFormContext();
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleNext = async () => {
    const valid = await trigger(["Availability", "Timezone"]); // ✅ validate these fields

    if (!valid) {
      const firstError = errors.Availability?.message || errors.Timezone?.message;
      setToast({
        show: true,
        message: firstError || "Please fill in the required fields",
        type: "error",
      });
      return;
    }
    nextStep();
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
          Step 3: Availability & Timezone
        </h2>

        <div className="flex flex-col gap-5">
          {/* Availability */}
          <div className="text-white text-sm">
            <label htmlFor="availability" className="block mb-2">
              When are you usually available?
            </label>
            <select
              id="availability"
              className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none"
              {...control.register("Availability", { required: "Availability is required" })}
            >
              <option value="">Select availability</option>
              <option value="Flexible">Flexible</option>
              <option value="Weekday mornings">Weekday mornings</option>
              <option value="Weekday afternoons">Weekday afternoons</option>
              <option value="Weekday evenings">Weekday evenings</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekends evenings">Weekends evenings</option>
            </select>
          </div>

          {/* Timezone dropdown */}
          <div className="text-white text-sm">
            <label className="block mb-2">Select Timezone</label>
              <Controller
                name="Timezone"
                control={control}
                rules={{ required: "Timezone is required" }}
                render={({ field }) => (
                  <TimezoneSelect
                    value={field.value} // keep full object {value, label}
                    onChange={(val) => field.onChange(val)} // store whole object
                    className="text-gray-900"
                  />
                )}
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="text-white">
                ← Back
              </button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="py-2 px-4 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md"
              >
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

export default SignupStep3;