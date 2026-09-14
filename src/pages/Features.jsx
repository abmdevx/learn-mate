import { motion } from "framer-motion";
import { Star, Users, Clock, Globe } from "lucide-react";

const features = [
  {
    icon: <Star className="w-6 h-6 text-orange-500" />,
    title: "Personalized Learning",
    description: "Choose topics and levels tailored to your goals."
  },
  {
    icon: <Users className="w-6 h-6 text-orange-500" />,
    title: "Find Learning Partners",
    description: "Connect with people who share your interests."
  },
  {
    icon: <Clock className="w-6 h-6 text-orange-500" />,
    title: "Flexible Scheduling",
    description: "Set your availability and learn at your own pace."
  },
  {
    icon: <Globe className="w-6 h-6 text-orange-500" />,
    title: "Global Community",
    description: "Collaborate with learners from different timezones."
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-10">
          ✨ Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-start gap-3"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Features;