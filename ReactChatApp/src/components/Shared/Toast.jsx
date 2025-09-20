import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

const Toast = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Toast Box */}
          <div className="relative z-10 bg-gray-800 border border-orange-500 text-white rounded-xl p-5 shadow-2xl w-[90%] max-w-sm text-center">
            <XCircle className="mx-auto mb-2 text-orange-500 h-10 w-10" />
            <p className="text-sm font-medium">{message}</p>

            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-orange-500 text-gray-900 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;