import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { listDoctors } from "../services/api";
import { Message } from "../shared/Message";
import { useNavigate, useLocation } from "react-router-dom";
import defaultDoctorImage from "../assets/doc.png";

export default function FindDoctors() {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocation] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [success, setSuccess] = useState(null);

const specialties = [
  "Dentistry",
  "Genralist",
  "Cardiologist",
  "Neurologist",
  "ENT",
  "Dermatologist",
  "Gynecologist",
  "Orthopedic",
  "Pediatrician",
  "Ophthalmologist",
  "Psychiatrist",
  "Urologist",
];


  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const cities = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Menia",
  ];

  useEffect(() => {
    const specialtyFromState = location.state?.specialty;

    if (specialtyFromState) {
      setSpecialtyFilter(specialtyFromState);
      setActiveFilters((prev) => ({
        ...prev,
        specialty: specialtyFromState,
      }));
      fetchDoctorsWithSpecialty(specialtyFromState);
    } else {
      fetchDoctors();
    }
  }, []);
  const fetchDoctorsWithSpecialty = async (specialty) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        speciality: specialty,
      };

      const response = await listDoctors(params);

      if (response && response.data) {
        const formattedDoctors = response.data.map((doctor) => ({
          id: doctor.id,
          name: doctor.name || "Unknown Doctor",
          specialty: doctor.speciality || getRandomSpecialty(),
          experience: `${
            Math.floor(Math.random() * 20) + 1
          } years experience overall`,
          location: `${doctor.city || "Unknown"}, ${doctor.street || ""}`,
          clinic: doctor.formations || "Medical Center",
          rating: doctor.rating || Math.floor(Math.random() * 20) + 80,
          patientStories: Math.floor(Math.random() * 100) + 10,
          gender: doctor.gender || (Math.random() > 0.5 ? "male" : "female"),
          picture: getDoctorImage(doctor),
          availability: ["Today", "Tomorrow", "Next Week"],
          typeConsultation:
            doctor.typeConsultation ||
            (Math.random() > 0.5 ? "In-person" : "Online"),
        }));

        setDoctors(formattedDoctors);

        if (response.links && response.links.last) {
          const lastPageUrl = new URL(response.links.last);
          const lastPage = parseInt(
            lastPageUrl.searchParams.get("page") || "1"
          );
          setTotalPages(lastPage);
        } else if (response.meta && response.meta.last_page) {
          setTotalPages(response.meta.last_page);
        } else {
          setTotalPages(Math.max(1, Math.ceil(response.data.length / 10)));
        }

        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please try again later.");
      setDoctors(generateMockDoctors());
      setTotalPages(2);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      if (specialtyFilter) {
        fetchDoctorsWithSpecialty(specialtyFilter);
      } else {
        fetchDoctors();
      }
    }
  }, [specialtyFilter, genderFilter, cityFilter, activeFilters]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };

      if (activeFilters.searchTerm) {
        params.name = activeFilters.searchTerm;
      }

      if (activeFilters.location) {
        params.city = activeFilters.location;
      }

      if (activeFilters.specialty) {
        params.speciality = activeFilters.specialty;
      }

      if (activeFilters.gender) {
        params.gender = activeFilters.gender;
      }

      const response = await listDoctors(params);

      if (response && response.data) {
        const formattedDoctors = response.data.map((doctor) => ({
          id: doctor.id,
          name: doctor.name || "Unknown Doctor",
          specialty: doctor.speciality || getRandomSpecialty(),
          experience: `${
            Math.floor(Math.random() * 20) + 1
          } years experience overall`,
          location: `${doctor.city || "Unknown"}, ${doctor.street || ""}`,
          clinic: doctor.formations || "Medical Center",
          rating: doctor.rating || Math.floor(Math.random() * 20) + 80,
          patientStories: Math.floor(Math.random() * 100) + 10,
          gender: doctor.gender || (Math.random() > 0.5 ? "male" : "female"),
          picture: getDoctorImage(doctor),
          availability: ["Today", "Tomorrow", "Next Week"],
          typeConsultation:
            doctor.typeConsultation ||
            (Math.random() > 0.5 ? "In-person" : "Online"),
        }));

        setDoctors(formattedDoctors);

        if (response.links && response.links.last) {
          const lastPageUrl = new URL(response.links.last);
          const lastPage = parseInt(
            lastPageUrl.searchParams.get("page") || "1"
          );
          setTotalPages(lastPage);
        } else if (response.meta && response.meta.last_page) {
          setTotalPages(response.meta.last_page);
        } else {
          setTotalPages(Math.max(1, Math.ceil(response.data.length / 10)));
        }

        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please try again later.");
      setDoctors(generateMockDoctors());
      setTotalPages(2);
    } finally {
      setLoading(false);
    }
  };

  const getRandomSpecialty = () => {
    return specialties[Math.floor(Math.random() * specialties.length)];
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
        gender: index % 2 === 0 ? "male" : "female",
        image:
          "https://imageio.forbes.com/specials-images/imageserve/626c7cf3616c1112ae834a2b/0x0.jpg?format=jpg&crop=1603,1603,x1533,y577,safe&height=416&width=416&fit=bounds",
        availability: ["Today", "Tomorrow", "Next Week"],
        typeConsultation: "In-person",
      }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setActiveFilters({
      ...activeFilters,
      searchTerm: searchTerm,
      location: locationSearch,
    });
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
    closeAllDropdowns();

    const sortedDoctors = [...doctors];
    if (sortOption === "Rating") {
      sortedDoctors.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "Experience") {
      sortedDoctors.sort((a, b) => {
        const expA = parseInt(a.experience.split(" ")[0]) || 0;
        const expB = parseInt(b.experience.split(" ")[0]) || 0;
        return expB - expA;
      });
    }
    setDoctors(sortedDoctors);
  };

  const handleSpecialtyChange = (specialty) => {
    setSpecialtyFilter(specialty);
    closeAllDropdowns();

    setActiveFilters({
      ...activeFilters,
      specialty: specialty,
    });
  };

  const handleGenderChange = (gender) => {
    setGenderFilter(gender);
    closeAllDropdowns();

    setActiveFilters({
      ...activeFilters,
      gender: gender,
    });
  };

  const handleCityChange = (city) => {
    setCityFilter(city);
    closeAllDropdowns();

    setActiveFilters({
      ...activeFilters,
      location: city,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSpecialtyFilter("");
    setGenderFilter("");
    setCityFilter("");
    setActiveFilters({});
    setCurrentPage(1);
  };

  const closeAllDropdowns = () => {
    setShowSpecialtyDropdown(false);
    setShowSortDropdown(false);
    setShowGenderDropdown(false);
    setShowCityDropdown(false);
  };

  const handleSpecialtyDropdownToggle = () => {
    closeAllDropdowns();
    setShowSpecialtyDropdown(!showSpecialtyDropdown);
  };

  const handleGenderDropdownToggle = () => {
    closeAllDropdowns();
    setShowGenderDropdown(!showGenderDropdown);
  };

  const handleCityDropdownToggle = () => {
    closeAllDropdowns();
    setShowCityDropdown(!showCityDropdown);
  };

  const handleSortDropdownToggle = () => {
    closeAllDropdowns();
    setShowSortDropdown(!showSortDropdown);
  };

  const handleViewProfile = (doctorId) => {
    navigate(`/doctor/${doctorId}?page=${currentPage}`);
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const getDoctorImage = (doctor) => {
    if (doctor?.picture) {
      return doctor.picture;
    }
    return defaultDoctorImage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      {error && (
        <Message type="error" message={error} onClose={() => setError("")} />
      )}

      {success && (
        <Message
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {/* Search Section with Filter */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search doctor by name"
                    className="w-full px-4 pl-10 py-2 sm:py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 text-white px-3 py-2 cursor-pointer rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium text-sm w-full sm:w-24"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <div className="relative">
                <button
                  onClick={handleSpecialtyDropdownToggle}
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
                  onClick={handleGenderDropdownToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  Gender:{" "}
                  {genderFilter
                    ? genderFilter === "male"
                      ? "Male"
                      : "Female"
                    : "All"}
                  <ChevronDown size={16} />
                </button>
                {showGenderDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleGenderChange("")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                      >
                        All Genders
                      </button>
                      {genders.map((gender) => (
                        <button
                          key={gender.value}
                          onClick={() => handleGenderChange(gender.value)}
                          className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                        >
                          {gender.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleCityDropdownToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  City: {cityFilter || "All"}
                  <ChevronDown size={16} />
                </button>
                {showCityDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => handleCityChange("")}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                      >
                        All Cities
                      </button>
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCityChange(city)}
                          className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded cursor-pointer text-gray-800 dark:text-slate-100"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleSortDropdownToggle}
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

              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors cursor-pointer"
                >
                  Clear Filters ({activeFilterCount})
                </button>
              )}
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
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={getDoctorImage(doctor)}
                            alt={doctor?.name || "Doctor"}
                            className="w-24 h-24 sm:w-36 sm:h-36 md:w-52 md:h-52 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                      </div>

                      <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-semibold text-blue-500">
                          {doctor.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{doctor.specialty}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {doctor.experience}
                        </p>

                        <div className="mt-3">
                          <p className="text-gray-600 flex items-center gap-1 justify-center sm:justify-start">
                            <MapPin size={16} className="text-gray-400" />
                            {doctor.location}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {doctor.clinic}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 justify-center sm:justify-start">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {doctor.rating}%
                          </span>
                          <span className="text-gray-500 text-sm">
                            {doctor.patientStories} Patient Stories
                          </span>
                          {doctor.gender && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                              {doctor.gender === "male" ? "Male" : "Female"}
                            </span>
                          )}
                          {doctor.typeConsultation && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                              {doctor.typeConsultation}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col self-end gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleViewProfile(doctor.id)}
                          className="bg-blue-50 text-blue-500 cursor-pointer px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium w-full sm:w-auto"
                        >
                          See Profile
                        </button>
                        <button
                          onClick={() =>
                            navigate("/bookConsultation", {
                              state: { doctor },
                            })
                          }
                          className="bg-blue-500 text-white cursor-pointer px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium w-full sm:w-auto"
                        >
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
