import { motion } from "framer-motion";
import { BookOpen, Users, Target, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-gray-900" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-orange-500 mb-4">
          About Us
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed mb-10">
          We believe learning should be <span className="text-orange-400">social</span>, 
          <span className="text-orange-400"> engaging</span>, and 
          <span className="text-orange-400"> global</span>.  
          Our platform connects learners from around the world to share knowledge, 
          collaborate, and grow together.
        </p>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <Target className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-300 text-sm">
              To empower learners by helping them find the right partners, 
              stay motivated, and achieve their goals through collaboration 
              and shared growth.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800/90 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <Sparkles className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-300 text-sm">
              To become the world’s most trusted hub for social learning — 
              where knowledge has no borders and collaboration creates endless opportunities.
            </p>
          </motion.div>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-orange-500 mb-6">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700 shadow-lg">
              <Users className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-semibold mb-1">Create Profile</h4>
              <p className="text-gray-300 text-sm">
                Set your goals, topics, skill level, and availability.
              </p>
            </div>
            <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700 shadow-lg">
              <Globe className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-semibold mb-1">Find Partners</h4>
              <p className="text-gray-300 text-sm">
                Match with learners worldwide who share your interests.
              </p>
            </div>
            <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700 shadow-lg">
              <BookOpen className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-semibold mb-1">Learn Together</h4>
              <p className="text-gray-300 text-sm">
                Collaborate, practice, and track progress as a team.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-orange-500 text-gray-900 px-6 py-4 rounded-full shadow-lg inline-block cursor-pointer font-semibold"
          onClick={() => navigate("/auth/signup")}
        >
          🚀 Start Your Learning Journey
        </motion.button>
      </motion.div>
    </div>
  );
};

export default About;