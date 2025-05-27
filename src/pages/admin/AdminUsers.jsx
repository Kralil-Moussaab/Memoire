import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Plus,
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getAllUsers, deletUser } from "../../services/api";
import { Message } from "../../shared/Message";

const ITEMS_PER_PAGE_TABLE = 5;
const ITEMS_PER_PAGE_GRID = 8;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    if (users.length === 0 && !loading) {
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phoneNumber: `+1234567${i.toString().padStart(4, "0")}`,
        age: 20 + (i % 30),
        sexe: i % 2 === 0 ? "male" : "female",
        groupage: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"][i % 8],
      }));
      setUsers(mockUsers);
    }
  }, [users, loading]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUsers();
        if (response && response.success) {
          setUsers(response.data);
        } else {
          setError(response?.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber &&
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.age && user.age.toString().includes(searchTerm.toLowerCase())) ||
      (user.sexe &&
        user.sexe.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.groupage &&
        user.groupage.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  useEffect(() => {
    const currentItemsPerPage =
      viewMode === "table" ? ITEMS_PER_PAGE_TABLE : ITEMS_PER_PAGE_GRID;
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredUsers.length / currentItemsPerPage)
    );
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
    if (filteredUsers.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    }
  }, [filteredUsers, viewMode, currentPage]);

  const currentItemsPerPage =
    viewMode === "table" ? ITEMS_PER_PAGE_TABLE : ITEMS_PER_PAGE_GRID;
  const indexOfLastUser = currentPage * currentItemsPerPage;
  const indexOfFirstUser = indexOfLastUser - currentItemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    console.log("Paginating to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteUser = async (id) => {
    console.log(`Attempting to delete user with ID: ${id}`);
    setDeletingUserId(id);
    try {
      const response = await deletUser(id);

      if (response.success) {
        console.log(`User ${id} deleted successfully.`);
        setUsers(users.filter((user) => user.id !== id));
        setMessage("User has been deleted successfully.");
        setMessageType("success");
      } else {
        console.error("Failed to delete user:", response.error);
        setMessage(`Failed to delete user: ${response.error}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("An error occurred while trying to delete the user.");
      setMessageType("error");
    } finally {
      setShowConfirmDelete(null);
      setSelectedUser(null);
      setDeletingUserId(null);
    }
  };

  const toggleDeleteConfirm = (e, userId) => {
    e.stopPropagation();
    setShowConfirmDelete(showConfirmDelete === userId ? null : userId);
    if (selectedUser === userId) {
      setSelectedUser(null);
    }
  };

  const UserCardView = ({ user }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg relative">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                <User size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(selectedUser === user.id ? null : user.id);
              }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="More options"
            >
              <MoreVertical size={20} />
            </button>
            {selectedUser === user.id && (
              <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 border-1 border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={(e) => toggleDeleteConfirm(e, user.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            <strong>Phone:</strong> {user.phoneNumber ?? "N/A"}
          </p>
          <p>
            <strong>Age:</strong> {user.age ?? "N/A"}
          </p>
          <p>
            <strong>Sex:</strong>{" "}
            <span className="capitalize">{user.sexe ?? "N/A"}</span>
          </p>
          <p>
            <strong>Blood Group:</strong> {user.groupage ?? "N/A"}
          </p>
        </div>
      </div>

      {showConfirmDelete === user.id && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center rounded-xl z-20">
          <div className="p-4 text-center">
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Are you sure you want to delete this user?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => handleDeleteUser(user.id)}
                disabled={deletingUserId === user.id}
                className={`bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-4 rounded ${
                  deletingUserId === user.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {deletingUserId === user.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block mr-1"></div>
                ) : null}
                Yes, Delete
              </button>
              <button
                onClick={(e) => toggleDeleteConfirm(e, user.id)}
                disabled={deletingUserId === user.id}
                className={`bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 ${
                  deletingUserId === user.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Pagination = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const currentItemsPerPage =
      viewMode === "table" ? ITEMS_PER_PAGE_TABLE : ITEMS_PER_PAGE_GRID;
    const firstItemIndex = (currentPage - 1) * currentItemsPerPage + 1;
    const lastItemIndex = Math.min(
      currentPage * currentItemsPerPage,
      filteredUsers.length
    );

    return (
      <div className="px-3 sm:px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between rounded-b-xl shadow-md">
        <div className="mb-3 sm:mb-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length > 0 ? firstItemIndex : 0} to{" "}
          {lastItemIndex} of {filteredUsers.length} users
        </div>
        <div className="flex space-x-1.5">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronLeft size={14} />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                currentPage === number
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Message
        type={messageType}
        message={message}
        onClose={() => setMessage(null)}
      />

      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
          <span>Manage Users</span>
          <span className="text-sm font-normal py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
            {filteredUsers.length} users
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          View and manage all registered users
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <button
                onClick={() =>
                  setViewMode(viewMode === "table" ? "grid" : "table")
                }
                className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {viewMode === "table" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-layout-grid mr-2"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    Card View
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-layout-list mr-2"
                    >
                      <rect width="7" height="6" x="3" y="3" rx="1" />
                      <path d="M14 6H21" />
                      <rect width="7" height="6" x="3" y="15" rx="1" />
                      <path d="M14 18H21" />
                    </svg>
                    Table View
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          <p>{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found.
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="overflow-x-auto rounded-t-xl shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="px-3 sm:px-6 text-center py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Age
                    </th>
                    <th className="px-3 sm:px-6 text-center py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Sex
                    </th>
                    <th className="px-3 sm:px-6 text-center py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Blood Group
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                              <User
                                size={16}
                                className="text-gray-500 dark:text-gray-400 sm:hidden"
                              />
                              <User
                                size={20}
                                className="text-gray-500 dark:text-gray-400 hidden sm:block"
                              />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 md:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6  py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                        {user.phoneNumber ?? "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 text-center py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                        {user.age ?? "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 text-center py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell capitalize">
                        {user.sexe ?? "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-center whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                        {user.groupage ?? "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-3">
                          <button
                            onClick={(e) => toggleDeleteConfirm(e, user.id)}
                            disabled={deletingUserId === user.id}
                            className={`text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 ${
                              deletingUserId === user.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              deletingUserId === user.id
                                ? "Deleting..."
                                : "Delete User"
                            }
                          >
                            {deletingUserId === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 dark:border-red-400"></div>
                            ) : (
                              <>
                                <Trash2 size={16} className="sm:hidden" />
                                <Trash2 size={18} className="hidden sm:block" />
                              </>
                            )}
                          </button>
                        </div>
                        {showConfirmDelete === user.id && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                            <p className="text-xs text-red-700 dark:text-red-400 mb-2">
                              Delete this user?
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deletingUserId === user.id}
                                className={`flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded ${
                                  deletingUserId === user.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {deletingUserId === user.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white inline-block mr-1"></div>
                                ) : null}
                                Yes
                              </button>
                              <button
                                onClick={(e) => toggleDeleteConfirm(e, user.id)}
                                disabled={deletingUserId === user.id}
                                className={`flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-1 rounded ${
                                  deletingUserId === user.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
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
          ) : (
            <div className="grid mb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentUsers.map((user) => (
                <UserCardView key={user.id} user={user} />
              ))}
            </div>
          )}

          {/* Render Pagination */}
          {filteredUsers.length > 0 && <Pagination />}
        </>
      )}
    </div>
  );
}
