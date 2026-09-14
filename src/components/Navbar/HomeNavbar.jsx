import { motion } from "framer-motion";
import { BookOpen, Home, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-gray-900 shadow-md border-b border-gray-800 fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <BookOpen className="text-orange-500 h-8 w-8 mr-2" />
              <span className="text-white text-xl font-bold">
                LearnMate
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {[
              { to: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
              { to: "/auth/login", label: "Login", icon: <LogIn className="h-5 w-5" /> },
              { to: "/auth/signup", label: "Signup", icon: <UserPlus className="h-5 w-5" /> },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={item.to}
                  className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                >
                  {item.icon && <span className="mr-2 text-xl">{item.icon}</span>}
                  {item.label}
                </Link>
              </motion.div> 
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-white hover:text-orange-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
            {[
              { to: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
              { to: "/auth/login", label: "Login", icon: <LogIn className="h-5 w-5" /> },
              { to: "/auth/signup", label: "Signup", icon: <UserPlus className="h-5 w-5" /> },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
              >
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-300"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default HomeNavbar;