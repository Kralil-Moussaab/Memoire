import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
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
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Home
          </Link>
          <Link
            to="/find"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Find Doctors
          </Link>
          <Link
            to="/consult"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
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
          <Link to="/login">
            <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all cursor-pointer">
              Login/Signup
            </button>
          </Link>
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
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 p-2 cursor-pointer"
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
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to="/find"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Find Doctors
            </Link>
            <Link
              to="/consult"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Online Consult
            </Link>
            <Link to="/login">
              <button className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-md cursor-pointer">
                Login/Signup
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}