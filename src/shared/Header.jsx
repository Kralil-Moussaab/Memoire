import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-blue-50 to-blue-100'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="." className="text-2xl font-bold text-blue-600">Med-Link</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="." className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium">Home</Link>
          <Link to="find" className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium">Find Doctors</Link>
          <a href="" className="text-gray-700 hover:text-blue-600 font-medium">Online Consult</a>
          <Link to="/login">
          <button className="bg-blue-600 hover:cursor-pointer text-white px-6 py-2.5 rounded-md hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Login/Signup
          </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <a href="" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50">Home</a>
            <a href="" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50">Find Doctors</a>
            <a href="" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-blue-50">Online Consult</a>
            <button className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-md">
              Login/Signup
            </button>
          </div>
        </div>
      )}
    </header>
  );
}