import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-800/90 shadow-2xl rounded-xl p-8 text-center border border-orange-500"
      >
        <h1 className="text-3xl font-bold text-orange-500 mb-4">404 - Not Found</h1>
        <p className="text-white mb-4">
          The route <span className="text-orange-400 font-semibold">{location.pathname}</span> was not found.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 py-2 px-4 bg-orange-500 text-gray-900 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all"
        >
          ⬅ Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;