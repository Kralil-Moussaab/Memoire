import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const doctors = Array(55).fill().map((_, index) => ({
  id: index + 1,
  name: 'Dr. Kralil Moussaab',
  specialty: 'Dentist',
  experience: '16 years experience overall',
  location: 'Sidi yacine,Sidi bel abbess',
  clinic: 'Smilescence Center for Advanced Dentistry +1',
  rating: 99,
  patientStories: 53,
  image: 'https://imageio.forbes.com/specials-images/imageserve/626c7cf3616c1112ae834a2b/0x0.jpg?format=jpg&crop=1603,1603,x1533,y577,safe&height=416&width=416&fit=bounds',
  availability: ['Today', 'Tomorrow', 'Next Week'],
}));

const itemsPerPage = 10;

export default function FindDoctors() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Relevance');
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Search Section with Filters */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Set your location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Ex: Doctor, Hospital"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-500 text-white px-8 cursor-pointer py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Search
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  Availability
                  <ChevronDown size={16} />
                </button>
                {showAvailabilityDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Available Today
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Available Tomorrow
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Available This Week
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  Filter
                  <ChevronDown size={16} />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Gender
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Experience
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="mr-2" /> Fees
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  Sort By: {sortBy}
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setSortBy('Relevance');
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded"
                      >
                        Relevance
                      </button>
                      <button 
                        onClick={() => {
                          setSortBy('Rating');
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded"
                      >
                        Rating
                      </button>
                      <button 
                        onClick={() => {
                          setSortBy('Experience');
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded"
                      >
                        Experience
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors List Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {doctors.length} doctors available
        </h2>

        <div className="space-y-6">
          {currentDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0 flex justify-center">
                    <div className="relative">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-36 h-36 md:w-52 md:h-52 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-blue-500">{doctor.name}</h3>
                    <p className="text-gray-600 mt-1">{doctor.specialty}</p>
                    <p className="text-gray-500 text-sm mt-1">{doctor.experience}</p>
                    
                    <div className="mt-3">
                      <p className="text-gray-600 flex items-center gap-1 justify-center md:justify-start">
                        <MapPin size={16} className="text-gray-400" />
                        {doctor.location}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{doctor.clinic}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {doctor.rating}% 
                      </span>
                      <span className="text-gray-500 text-sm">
                        {doctor.patientStories} Patient Stories
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 justify-center self-end">
                    <button className="bg-blue-50 text-blue-500 cursor-pointer px-8 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium w-full sm:w-auto">
                        See Profile
                    </button>
                    <button className="bg-blue-500 text-white cursor-pointer px-8 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium w-full sm:w-auto">
                        Book Consultation
                    </button>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Improved responsive design */}
        <div className="flex justify-center mt-8 px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-blue-500 transition-colors min-w-[90px]"
            >
              Previous
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors min-w-[40px] ${
                    pageNum === currentPage
                      ? 'bg-blue-500 text-white'
                      : pageNum === '...'
                      ? 'border border-transparent cursor-default'
                      : 'border border-gray-200 hover:border-blue-500'
                  }`}
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-blue-500 transition-colors min-w-[90px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}