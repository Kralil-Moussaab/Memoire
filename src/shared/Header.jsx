import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, LogOut, User, Calendar, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    if (!token) {
      setShowProfileMenu(false);
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const renderAuthButtons = () => {
    if (!token) {
      return (
        <Link to="/login">
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all cursor-pointer">
            Login/Signup
          </button>
        </Link>
      );
    }

    if (userType === "user") {
      return (
        <div className="relative profile-menu-container">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center space-x-2 ${showProfileMenu
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
              <User size={20} />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
              <Link
                to="/profile"
                className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isActivePath("/profile")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span>{user?.name || "Profile"}</span>
                </div>
              </Link>
              <Link
                to="/mychat"
                className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isActivePath("/mychat")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
                  }`}
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare size={18} />
                  <span>My Chat</span>
                </div>
              </Link>
              <Link
                to="/myappointments"
                className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isActivePath("/myappointments")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>My Appointments</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800"
          : "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            Med-Link
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium ${isActivePath("/")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            Home
          </Link>
          <Link
            to="/find"
            className={`font-medium ${isActivePath("/find")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            Find Doctors
          </Link>
          <Link
            to="/consult"
            className={`font-medium ${isActivePath("/consult")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            Online Consult
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="text-yellow-500" size={20} />
            ) : (
              <Moon className="text-gray-700 dark:text-gray-300" size={20} />
            )}
          </button>
          {renderAuthButtons()}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="text-yellow-500" size={20} />
            ) : (
              <Moon className="text-gray-700 dark:text-gray-300" size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 cursor-pointer ${isMenuOpen
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
              }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/find"
              className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/find")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Find Doctors
            </Link>
            <Link
              to="/consult"
              className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/consult")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Online Consult
            </Link>
            {token && userType === "user" && (
              <>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/profile")
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/mychat"
                  className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/myappointments")
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Chat
                </Link>
                <Link
                  to="/myappointments"
                  className={`block px-3 py-2 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 ${isActivePath("/myappointments")
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Appointments
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-500 font-medium rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </>
            )}
            {!token && (
              <Link
                to="/login"
                className="block px-3 py-2 text-center font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}