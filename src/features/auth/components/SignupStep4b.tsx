import { useState, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion } from "motion/react";

const SignupStep4b = ({ nextStep, prevStep, gender }) => {
  const { setValue, watch } = useFormContext();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const savedAvatar = watch("Avatar");

  const createAvatar = (seed, sex) => ({ ...genConfig(seed), sex });

  // ✅ generate avatars only once
    const maleAvatars = useMemo(
    () => [
        createAvatar("male-avatar-1", "man"),
        createAvatar("male-avatar-2", "man"),
        createAvatar("male-avatar-3", "man"),
        createAvatar("male-avatar-4", "man"),
        createAvatar("male-avatar-5", "man"),
        createAvatar("male-avatar-6", "man"),
    ],
    []
    );

  const femaleAvatars = useMemo(
    () => [
        createAvatar("female-avatar-1", "woman"),
        createAvatar("female-avatar-2", "woman"),
        createAvatar("female-avatar-3", "woman"),
        createAvatar("female-avatar-4", "woman"),
        createAvatar("female-avatar-5", "woman"),
        createAvatar("female-avatar-6", "woman"),
    ],
    []
);

  const avatars = gender === "male" ? maleAvatars : femaleAvatars;

  useEffect(() => {
    if (!savedAvatar) return;
    const savedConfig = typeof savedAvatar === "string" ? JSON.parse(savedAvatar) : savedAvatar;
    const index = avatars.findIndex((config) => JSON.stringify(config) === JSON.stringify(savedConfig));
    if (index >= 0) {
      setSelectedIndex(index);
      setSelectedConfig(avatars[index]);
    }
  }, [avatars, savedAvatar]);

  const handlePredefinedSelect = (config, index) => {
    setSelectedIndex(index);
    setSelectedConfig(config);
    setValue("Avatar", config);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-gray-800/90 shadow-xl rounded-xl p-6 border border-orange-500">
        <h2 className="text-lg font-bold text-orange-500 text-center mb-4">
          Choose Your Avatar
        </h2>

        {/* Avatar grid */}
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {avatars.map((cfg, idx) => (
            <div
              key={idx}
              onClick={() => handlePredefinedSelect(cfg, idx)}
              className={`w-20 h-20 rounded-full cursor-pointer border-4 transition-all ${
                selectedIndex === idx
                  ? "border-green-500 scale-110"
                  : "border-transparent"
              }`}
            >
              <Avatar style={{ width: "100%", height: "100%" }} {...cfg} />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full mt-6">
          <button type="button" onClick={prevStep} className="text-white">
            ← Back
          </button>
          <button
            type="button"
            disabled={!selectedConfig}
            onClick={nextStep}
            className="py-2 px-4 bg-green-500 text-gray-900 rounded-lg font-semibold shadow-md disabled:opacity-50"
          >
            Select Avatar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupStep4b;