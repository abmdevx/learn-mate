import { Github, Linkedin, BookOpen, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-orange-200 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 items-start">
        {/* Logo & Tagline */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-gray-900" />
            </div>
            <h2 className="text-lg font-bold text-white">LearningMatch</h2>
          </div>
          <p className="text-white text-xs leading-relaxed">
            Find your perfect study partner and achieve your goals together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold mb-2 text-orange-500">Quick Links</h3>
          <ul className="space-y-1 text-white">
            <li>
              <NavLink to={"/"} className="hover:text-orange-500 transition-colors">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/features"} className="hover:text-orange-500 transition-colors">
                Features
              </NavLink>
            </li>
            <li>
              <NavLink to={"/about"} className="hover:text-orange-500 transition-colors">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to={"/copyright"} className="hover:text-orange-500 transition-colors">
                Copyright
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-base font-semibold mb-2 text-orange-400">Follow Us</h3>
          <div className="flex space-x-3 text-white">
            <a
              href="https://github.com/abdullahbutt09"
              className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-orange-500 hover:text-gray-900 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://api.whatsapp.com/message/XQK4QBYGVOVQL1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-orange-500 hover:text-gray-900 transition"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-4 py-3 text-center text-xs text-white flex flex-col gap-2">
        <span>© {new Date().getFullYear()} LearningMatch. All rights reserved.</span>
        <a
          href="https://github.com/your-username/your-repo/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-400 text-xs"
        >
          Report an Issue
        </a>
      </div>
    </footer>
  );
};

export default Footer;