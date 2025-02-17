// import { Outlet } from 'react-router-dom';
// import { Heart, Menu, X } from 'lucide-react';
// import { useState } from 'react';

// export default function Layout() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <div className="flex items-center">
//             <span className="text-2xl font-bold text-blue-600">Med-Link</span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
//             <a href="/doctors" className="text-gray-700 hover:text-blue-600">Find Doctors</a>
//             <a href="/consult" className="text-gray-700 hover:text-blue-600">Online Consult</a>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//               Login/Signup
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-blue-600"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </nav>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <a href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</a>
//               <a href="/doctors" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Find Doctors</a>
//               <a href="/consult" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Online Consult</a>
//               <button className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                 Login/Signup
//               </button>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Med-Link</h3>
//               <p className="text-gray-400">Sidi yacine,Sidi bel abbes</p>
//               <p className="text-gray-400">+213663522516</p>
//               <p className="text-gray-400">info@Med-Link.com</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
//                 <li><a href="/pricing" className="text-gray-400 hover:text-white">Our Pricing</a></li>
//                 <li><a href="/gallery" className="text-gray-400 hover:text-white">Our Gallery</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Services</h3>
//               <ul className="space-y-2">
//                 <li><a href="/services/orthology" className="text-gray-400 hover:text-white">Orthology</a></li>
//                 <li><a href="/services/neurology" className="text-gray-400 hover:text-white">Neurology</a></li>
//                 <li><a href="/services/cardiology" className="text-gray-400 hover:text-white">Cardiology</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Support</h3>
//               <ul className="space-y-2">
//                 <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
//                 <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
//                 <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400">© 2024 Med-Link.com. All Rights Reserved</p>
//             <div className="flex space-x-4 mt-4 md:mt-0">
//               <Heart className="text-red-500" size={24} />
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}