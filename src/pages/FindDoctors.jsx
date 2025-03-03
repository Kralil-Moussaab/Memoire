import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { listDoctors } from "../services/api";

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const specialties = [
    "Dentist",
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Gynecologist",
    "ENT Specialist",
    "General Practitioner",
  ];

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, specialtyFilter]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };

      if (searchTerm) {
        params.name = searchTerm;
      }

      if (location) {
        params.city = location;
      }

      if (specialtyFilter) {
        params.speciality = specialtyFilter;
      }

      const response = await listDoctors(params);

      const formattedDoctors = response.data.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.speciality || "Specialist",
        experience: "Experienced healthcare professional",
        location: `${doctor.city || "Unknown"}, ${doctor.street || ""}`,
        clinic: doctor.formations || "Medical Center",
        rating: doctor.rating || 95,
        patientStories: Math.floor(Math.random() * 100) + 10, 
        image:
          "https://imageio.forbes.com/specials-images/imageserve/626c7cf3616c1112ae834a2b/0x0.jpg?format=jpg&crop=1603,1603,x1533,y577,safe&height=416&width=416&fit=bounds",
        availability: ["Today", "Tomorrow", "Next Week"],
        typeConsultation: doctor.typeConsultation || "In-person",
      }));

      setDoctors(formattedDoctors);
      setTotalPages(response.meta?.last_page || 1);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please try again later.");
      setDoctors(generateMockDoctors());
      setTotalPages(6);
    } finally {
      setLoading(false);
    }
  };

  const generateMockDoctors = () => {
    return Array(10)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        name: "Dr. Kralil Moussaab",
        specialty: "Dentist",
        experience: "16 years experience overall",
        location: "Sidi yacine, Sidi bel abbess",
        clinic: "Smilescence Center for Advanced Dentistry +1",
        rating: 99,
        patientStories: 53,
        image:
          "https://imageio.forbes.com/specials-images/imageserve/626c7cf3616c1112ae834a2b/0x0.jpg?format=jpg&crop=1603,1603,x1533,y577,safe&height=416&width=416&fit=bounds",
        availability: ["Today", "Tomorrow", "Next Week"],
        typeConsultation: "In-person",
      }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    fetchDoctors();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);

  };

  const handleSpecialtyChange = (specialty) => {
    setSpecialtyFilter(specialty);
    setShowSpecialtyDropdown(false);
    setCurrentPage(1); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      {/* Search Section with Filter */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Set your location"
                    className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search doctor by name"
                    className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-8 cursor-pointer py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button
                  onClick={() =>
                    setShowSpecialtyDropdown(!showSpecialtyDropdown)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  Specialty: {specialtyFilter || "All"}
                  <ChevronDown size={16} />
                </button>
                {showSpecialtyDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => handleSpecialtyChange("")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                      >
                        All Specialties
                      </button>
                      {specialties.map((specialty) => (
                        <button
                          key={specialty}
                          onClick={() => handleSpecialtyChange(specialty)}
                          className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  Sort By: {sortBy}
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleSortChange("Relevance")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                      >
                        Relevance
                      </button>
                      <button
                        onClick={() => handleSortChange("Rating")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                      >
                        Rating
                      </button>
                      <button
                        onClick={() => handleSortChange("Experience")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-6">
              {doctors.length} doctors available
            </h2>

            <div className="space-y-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
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

                      <div className="flex-grow text-center md:text-left">
                        <h3 className="text-2xl font-semibold text-blue-500">
                          {doctor.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{doctor.specialty}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {doctor.experience}
                        </p>

                        <div className="mt-3">
                          <p className="text-gray-600 flex items-center gap-1 justify-center md:justify-start">
                            <MapPin size={16} className="text-gray-400" />
                            {doctor.location}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {doctor.clinic}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {doctor.rating}%
                          </span>
                          <span className="text-gray-500 text-sm">
                            {doctor.patientStories} Patient Stories
                          </span>
                          {doctor.typeConsultation && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                              {doctor.typeConsultation}
                            </span>
                          )}
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

            {doctors.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No doctors found
                </p>
              </div>
            )}

            {doctors.length > 0 && (
              <div className="flex justify-center mt-8 px-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-blue-500 transition-colors min-w-[90px] cursor-pointer"
                  >
                    Previous
                  </button>
                  <div className="flex flex-wrap justify-center gap-2">
                    {getPageNumbers().map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNum === "number" &&
                          handlePageChange(pageNum)
                        }
                        className={`px-3 py-2 rounded-lg transition-colors min-w-[40px] cursor-pointer ${
                          pageNum === currentPage
                            ? "bg-blue-500 text-white"
                            : pageNum === "..."
                            ? "border border-transparent cursor-default"
                            : "border border-gray-200 hover:border-blue-500"
                        }`}
                        disabled={pageNum === "..."}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-blue-500 transition-colors min-w-[90px] cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}