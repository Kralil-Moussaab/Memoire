import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Trash2,
  Edit,
  Check,
  X,
  Plus,
  Star,
  Users,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      status: "Active",
      patients: 150,
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Brown",
      specialty: "Neurologist",
      status: "Active",
      patients: 120,
      rating: 4.5,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      status: "Inactive",
      patients: 90,
      rating: 4.7,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 4,
      name: "Dr. Robert Wilson",
      specialty: "Dermatologist",
      status: "Active",
      patients: 135,
      rating: 4.6,
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 5,
      name: "Dr. Jennifer Lee",
      specialty: "Psychiatrist",
      status: "On Leave",
      patients: 110,
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const handleClickOutside = () => {
      setShowStatusDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || doctor.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusFilterClick = (e) => {
    e.stopPropagation();
    setShowStatusDropdown(!showStatusDropdown);
  };

  const toggleEditDoctor = (doctorId) => {
    if (editingDoctor === doctorId) {
      setEditingDoctor(null);
    } else {
      setEditingDoctor(doctorId);
      setShowConfirmDelete(null);
    }
  };

  const toggleDeleteConfirm = (e, doctorId) => {
    e.stopPropagation();
    if (showConfirmDelete === doctorId) {
      setShowConfirmDelete(null);
    } else {
      setShowConfirmDelete(doctorId);
      setEditingDoctor(null);
    }
  };

  const deleteDoctor = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    setShowConfirmDelete(null);
  };

  const handleStatusChange = (doctorId, newStatus) => {
    setDoctors(
      doctors.map(doctor =>
        doctor.id === doctorId ? { ...doctor, status: newStatus } : doctor
      )
    );
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
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Manage Doctors
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage all registered doctors in the system
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <button
                onClick={handleStatusFilterClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 w-full sm:w-auto justify-between sm:justify-start"
              >
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                </div>
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border dark:border-gray-700">
                  <div className="py-1">
                    {["all", "active", "inactive", "on leave"].map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
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

            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded-md ${viewMode === "table"
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
                className={`px-3 py-2 rounded-md ${viewMode === "grid"
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

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors duration-200">
              <Plus size={18} />
              <span>Add Doctor</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Doctors</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{doctors.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Doctors</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {doctors.filter(d => d.status === "Active").length}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {doctors.filter(d => d.status === "Inactive").length}
              </h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <X className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">On Leave</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {doctors.filter(d => d.status === "On Leave").length}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 dark:text-yellow-400">
                <path d="M2 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
                <path d="M9 9h.01"></path>
                <path d="M15 9h.01"></path>
                <path d="M8 13h8"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Specialty
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Patients
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Rating
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          src={doctor.image}
                          alt={doctor.name}
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                            {doctor.specialty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {doctor.specialty}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {editingDoctor === doctor.id ? (
                        <select
                          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={doctor.status}
                          onChange={(e) => handleStatusChange(doctor.id, e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : doctor.status === "Inactive"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                        >
                          {doctor.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {doctor.patients}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 dark:text-white mr-2">
                          {doctor.rating}
                        </span>
                        {renderStars(doctor.rating)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex space-x-2 justify-end">
                        {showConfirmDelete === doctor.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteDoctor(doctor.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleEditDoctor(doctor.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0 text-sm text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstDoctor + 1} to {Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} doctors
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded-md ${currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-xl"
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                    />
                  </div>
                </div>

                <div className="pt-12 pb-4 px-4">
                  <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mt-1">
                    {doctor.specialty}
                  </p>

                  <div className="flex justify-center mt-3">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : doctor.status === "Inactive"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                    >
                      {doctor.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {doctor.patients} patients
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
                        {doctor.rating}
                      </span>
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-1 flex items-center justify-center gap-1 transition-colors duration-200">
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => toggleDeleteConfirm(e, doctor.id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded py-1 flex items-center justify-center gap-1 transition-colors duration-200">
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {showConfirmDelete === doctor.id && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <p className="text-xs text-red-700 dark:text-red-400 mb-2">Are you sure you want to delete this doctor?</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteDoctor(doctor.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmDelete(null);
                          }}
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

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded-md ${currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-colors duration-200">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}