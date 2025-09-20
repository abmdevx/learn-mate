import { motion } from "framer-motion";
import { useFormContext , Controller } from "react-hook-form";
import TimezoneSelect from "react-timezone-select";
import InputField from "../Shared/InputField";

const SignupStep3 = ({ nextStep, prevStep }) => {
  const { register, watch, control } = useFormContext();

  const availability = watch("Availability");
  const timezone = watch("Timezone");

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
          <InputField
            type="text"
            placeholder="Availability (e.g. Weekends, Evenings)"
            {...register("Availability")}
          />

          {/* Timezone dropdown */}
          <div className="text-white text-sm">
            <label className="block mb-2">Select Timezone</label>
              <Controller
                name="Timezone"
                control={control}
                render={({ field }) => (
                  <TimezoneSelect
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(val) => field.onChange(val.value)}
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
                onClick={nextStep} // ✅ this only changes step, parent form handles submit
                className="py-2 px-4 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md"
              >
                Next →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default SignupStep3;