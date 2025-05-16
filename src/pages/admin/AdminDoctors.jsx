import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Trash2,
  Check,
  X,
  Plus,
  Star,
  Users,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { listDoctors, getDoctorAdminStats } from "../../services/api";
import defaultDoctorImage from "../../assets/doc.png";

const specialties = [
  "Dentist",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic",
  "Gynecologist",
  "Generalist"
];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [doctorStats, setDoctorStats] = useState({
    totalDoctor: 0,
    totalDoctorOnline: 0,
    totalDoctorOffline: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, statusFilter, specialtyFilter]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const response = await getDoctorAdminStats();
        if (response.success && response.data) {
          setDoctorStats(response.data);
        } else {
          setStatsError(response.error || "Failed to fetch doctor stats");
        }
      } catch (err) {
        console.error("Failed to fetch doctor stats:", err);
        setStatsError("Failed to load doctor stats. Please try again.");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []); 

  useEffect(() => {
    const handleClickOutside = () => {
      setShowStatusDropdown(false);
      setShowSpecialtyDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };

      if (searchTerm) {
        params.name = searchTerm;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (specialtyFilter) {
        params.speciality = specialtyFilter;
      }

      const response = await listDoctors(params);

      if (response && response.data) {
        setDoctors(response.data);
        if (response.meta && response.meta.last_page) {
          setTotalPages(response.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(timer);
  };

  const getDoctorImage = (doctor) => {
    if (doctor?.picture) {
      return doctor.picture;
    }
    return defaultDoctorImage;
  };

  const handleStatusToggle = (doctorId) => {
    setDoctors(doctors.map(doctor => {
      if (doctor.id === doctorId) {
        const newStatus = doctor.status === "online" ? "offline" : "online";
        return { ...doctor, status: newStatus };
      }
      return doctor;
    }));
  };

  const handleDeleteDoctor = (id) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
    setShowConfirmDelete(null);
  };

  const toggleDeleteConfirm = (e, doctorId) => {
    e.stopPropagation();
    setShowConfirmDelete(showConfirmDelete === doctorId ? null : doctorId);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < fullStars ? "fill-yellow-400 text-yellow-400" :
              (i === fullStars && hasHalfStar ? "text-yellow-400" : "text-gray-300")}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
          <span>Manage Doctors</span>
          <span className="text-sm font-normal py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
            {doctorStats.totalDoctor} doctors
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          View and manage all registered doctors
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowSpecialtyDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 w-full sm:w-auto justify-between sm:justify-start"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                </div>
                <ChevronDown size={14} />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border dark:border-gray-700">
                  <div className="py-1">
                    {["all", "online", "offline"].map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 capitalize"
                      >
                        {status === "all" ? "All Status" : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpecialtyDropdown(!showSpecialtyDropdown);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 w-full sm:w-auto justify-between sm:justify-start"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{specialtyFilter || "All Specialties"}</span>
                </div>
                <ChevronDown size={14} />
              </button>
              {showSpecialtyDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border dark:border-gray-700">
                  <div className="py-1 max-h-56 overflow-y-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSpecialtyFilter("");
                        setShowSpecialtyDropdown(false);
                        setCurrentPage(1);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      All Specialties
                    </button>
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSpecialtyFilter(specialty);
                          setShowSpecialtyDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("table")}
                className={`px-2 sm:px-3 py-2 rounded-md ${viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } flex items-center gap-1`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2 sm:px-3 py-2 rounded-md ${viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } flex items-center gap-1`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Doctors</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{doctorStats.totalDoctor}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online Doctors</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {doctorStats.totalDoctorOnline}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Offline</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {doctorStats.totalDoctorOffline}
              </h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <X className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No doctors found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                          src={getDoctorImage(doctor)}
                          alt={doctor.name}
                        />
                        <div className="ml-2 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {doctor.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {doctor.speciality}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
                        {doctor.email}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
                        {doctor.phoneNumber}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-white flex items-center">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
                        {doctor.city}, {doctor.street}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === "online"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {showConfirmDelete === doctor.id && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md text-left">
                          <p className="text-xs text-red-700 dark:text-red-400 mb-2">
                            Delete this doctor?
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteDoctor(doctor.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-1 rounded"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-3 sm:px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-3 sm:mb-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, doctors.length)} of {doctors.length} doctors
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-2 sm:px-3 py-1 rounded-md ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronLeft size={14} />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (totalPages > 5 &&
                    (pageNumber > 2 && pageNumber < currentPage - 1) ||
                    (pageNumber > currentPage + 1 && pageNumber < totalPages - 1)) {
                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return <span key={pageNumber} className="px-2 py-1">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-2 sm:px-3 py-1 rounded-md ${currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-2 sm:px-3 py-1 rounded-md ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={getDoctorImage(doctor)}
                    alt={doctor.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {doctor.speciality}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${doctor.status === "online"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                  >
                    {doctor.status}
                  </span>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mr-1">
                      {doctor.rating || "4.5"}
                    </span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>

                <div className="mt-3 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <Mail size={14} className="mr-1" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone size={14} className="mr-1" />
                    <span>{doctor.phoneNumber}</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <button
                    onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                    className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>

                {showConfirmDelete === doctor.id && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-xs text-red-700 dark:text-red-400 mb-2">
                      Are you sure you want to delete this doctor?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}