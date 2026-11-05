import { useState, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Avatar, { genConfig } from "react-nice-avatar";
import type { HairStyle } from "react-nice-avatar";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";

const SignupStep4b = ({ nextStep, prevStep, gender }) => {
  const { setValue, watch } = useFormContext();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [avatarSetVersion, setAvatarSetVersion] = useState(0);
  const savedAvatar = watch("Avatar");

  const createAvatar = (sex, index) => {
    const isFemale = sex === "woman";
    const maleHairStyles: HairStyle[] = ["normal", "thick", "mohawk"];
    const config = genConfig({
      sex,
      hairStyle: isFemale
        ? "womanLong"
        : maleHairStyles[index % maleHairStyles.length],
      ...(isFemale ? { eyeBrowStyle: "upWoman" } : {}),
    });

    return {
      ...config,
      sex,
      hairStyle: isFemale ? "womanLong" : config.hairStyle,
      ...(isFemale ? { eyeBrowStyle: "upWoman" } : {}),
    };
  };

  // ✅ generate avatars only once
    const maleAvatars = useMemo(
    () => [
        createAvatar("man", 0),
        createAvatar("man", 1),
        createAvatar("man", 2),
        createAvatar("man", 3),
        createAvatar("man", 4),
        createAvatar("man", 5),
    ],
    [avatarSetVersion]
    );

  const femaleAvatars = useMemo(
    () => [
        createAvatar("woman", 0),
        createAvatar("woman", 1),
        createAvatar("woman", 2),
        createAvatar("woman", 3),
        createAvatar("woman", 4),
        createAvatar("woman", 5),
    ],
  [avatarSetVersion]
);

  const avatars = gender === "male"
    ? maleAvatars
    : gender === "female"
      ? femaleAvatars
      : [];

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

  const refreshAvatars = () => {
    setSelectedIndex(null);
    setSelectedConfig(null);
    setValue("Avatar", "");
    setAvatarSetVersion((version) => version + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-gray-800/90 shadow-xl rounded-xl p-6 border border-orange-500">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex-1 text-center text-lg font-bold text-orange-500">
            Choose Your Avatar
          </h2>
          <button
            type="button"
            onClick={refreshAvatars}
            className="rounded-lg p-2 text-orange-500 transition-colors hover:bg-orange-500/10 hover:text-orange-400"
            aria-label="Refresh avatars"
            title="Refresh avatars"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

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