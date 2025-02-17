import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">Med-Link</h3>
            <div className="space-y-4">
              <p className="flex items-center text-gray-300">
                <MapPin size={18} className="mr-2 text-blue-400" />
                Sidi yacine, Sidi bel abbes
              </p>
              <p className="flex items-center text-gray-300">
                <Phone size={18} className="mr-2 text-blue-400" />
                +213663522516
              </p>
              <p className="flex items-center text-gray-300">
                <Mail size={18} className="mr-2 text-blue-400" />
                info@Med-Link.com
              </p>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>About Us
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Our Pricing
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Our Gallery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="/services/orthology" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Orthology
                </a>
              </li>
              <li>
                <a href="/services/neurology" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Neurology
                </a>
              </li>
              <li>
                <a href="/services/cardiology" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Cardiology
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span>Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 Med-Link.com. All Rights Reserved</p>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <span className="text-gray-400">Made with</span>
            <Heart className="text-red-500" size={20} />
            <span className="text-gray-400">by Med-Link Team</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </footer>
  );
}