import { motion } from "framer-motion";
import { Bell, LayoutDashboard, Layers, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../../Redux/AuthThunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import notificationService from "../../appwrite/notifications";
import authService from "../../appwrite/auth";

const UserNavbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const user = useSelector((state) => state.auth.userData);

  const fetchNotifications = async () => {
    const count = await notificationService.getUnreadCount(user.$id);
    setUnreadCount(count);
  };

  const openNotifications = async () => {
    setNotifOpen(!notifOpen);

    if (!notifOpen) {
      const notifs = await notificationService.getUserNotifications(user.$id);

      // 🔹 Fetch usernames for all senderIds in notifications
      const notificationsWithNames = await Promise.all(
        notifs.map(async (n) => {
          try {
            console.log("senderid ja rahi ha? ", n.SenderId);
            const senderProfile = await authService.getProfile(n.SenderId);
            return {
              ...n,
              senderName: senderProfile?.Name || "Unknown User",
            };
          } catch {
            return { ...n, senderName: "Unknown User" };
          }
        })
      );

      setNotifications(notificationsWithNames);

      await notificationService.markAllAsRead(user.$id);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!user?.$id) return;
    fetchNotifications();

    // Optional: poll every 10s
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notif-dropdown") && notifOpen) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);


  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ ref for dropdown

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Animation Variants
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
            <Link to="/dashboard" className="flex items-center">
              <LayoutDashboard className="text-orange-500 h-7 w-7 mr-2" />
              <span className="text-white text-xl font-bold">LearnMate</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {[ 
              { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
              { to: "/features", label: "Features", icon: <Layers className="h-5 w-5" /> },
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
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <div className="relative">
              {/* Notification Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={openNotifications}
                className="relative text-gray-300 hover:text-orange-500"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-xs text-white rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50"
                >
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.$id} className="px-4 py-2 hover:bg-gray-700">
                        {n.senderName} liked your profile!
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400 text-sm text-center">
                      No new notifications
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDropdown}
                className="flex items-center text-gray-300 hover:text-orange-500 focus:outline-none"
              >
                <User className="h-6 w-6" />
              </motion.button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2"
                >
                  <Link to="/profile"
                  onClick={() => setDropdownOpen(false)} // ✅ close on click
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500 flex items-center">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </Link>
                  <Link to="/settings" 
                  onClick={() => setDropdownOpen(false)} // ✅ close on click
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500 flex items-center">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Link>
                  <button 
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false); // ✅ close on logout
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500 flex items-center">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </motion.div>
              )}
            </div>
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
              { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
              { to: "/features", label: "Features", icon: <Layers className="h-5 w-5" /> },
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
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Profile Options */}
            <div className="border-t border-gray-700 pt-2">
              <Link to="/profile" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">
                Profile
              </Link>
              <Link to="/settings" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">
                Settings
              </Link>
              <button
              onClick={handleLogout} 
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default UserNavbar;