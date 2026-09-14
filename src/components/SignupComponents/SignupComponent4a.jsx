// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import multiavatar from "@multiavatar/multiavatar";
// import InputField from "../Shared/InputField";

// const SignupStep4 = ({ nextStep, prevStep }) => {
//   const { setValue } = useFormContext();
//   const [seed, setSeed] = useState("default");

//   // generate avatar SVG
//   const avatarSvg = multiavatar(seed);

//   // store selected avatar in react-hook-form
//   const handleSelect = () => {
//     setValue("Avatar", avatarSvg); // saving svg string
//     nextStep();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-sm bg-gray-800/90 shadow-2xl rounded-xl p-6 border border-orange-500"
//       >
//         <h2 className="text-lg font-bold text-orange-500 text-center mb-4">
//           Step 3: Choose Your Avatar
//         </h2>

//         <div className="flex flex-col items-center gap-5">
//           {/* Avatar preview */}
//           <div
//             className="w-32 h-32 rounded-full border border-orange-500 flex items-center justify-center bg-white"
//             dangerouslySetInnerHTML={{ __html: avatarSvg }}
//           />

//           {/* Change seed to generate a new one */}
//           <InputField
//             type="text"
//             value={seed}
//             onChange={(e) => setSeed(e.target.value)}
//             placeholder="Enter name or random seed"
//           />

//           {/* Navigation buttons */}
//           <div className="flex justify-between w-full mt-4">
//             <button
//               type="button"
//               onClick={prevStep}
//               className="text-white"
//             >
//               ← Back
//             </button>
//             <motion.button
//               type="button"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//               onClick={handleSelect}
//               className="py-2 px-4 bg-green-500 text-gray-900 rounded-lg font-semibold shadow-md"
//             >
//               Select Avatar
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default SignupStep4;

import { motion } from "framer-motion";

const SignupComponent4a = ({ nextStep, prevStep, setGender }) => {
  const handleSelect = (gender) => {
    setGender(gender);
    nextStep();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-800/90 shadow-xl rounded-xl p-6 border border-orange-500"
      >
        <h2 className="text-lg font-bold text-orange-500 text-center mb-4">
          Select Gender
        </h2>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => handleSelect("male")}
            className="px-4 py-2 bg-blue-500 rounded-lg text-white w-40"
          >
            Male
          </button>
          <button
            onClick={() => handleSelect("female")}
            className="px-4 py-2 bg-pink-500 rounded-lg text-white w-40"
          >
            Female
          </button>
        </div>

        <div className="flex justify-between w-full mt-6">
          <button type="button" onClick={prevStep} className="text-white">
            ← Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupComponent4a;