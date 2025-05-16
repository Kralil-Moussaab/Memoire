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
    ChevronsRight
} from "lucide-react";
import { getAllUsers } from "../../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("table");
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (users.length === 0 && !loading) {
            const mockUsers = Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                phoneNumber: `+1234567${i.toString().padStart(4, '0')}`,
                age: 20 + (i % 30),
                sexe: i % 2 === 0 ? 'male' : 'female',
                groupage: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"][i % 8]
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
            (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.age && user.age.toString().includes(searchTerm.toLowerCase())) ||
            (user.sexe && user.sexe.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.groupage && user.groupage.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    useEffect(() => {
        const newTotalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
        setTotalPages(newTotalPages);

        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
        }
    }, [filteredUsers, itemsPerPage, currentPage]);

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
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

    const UserCardView = ({ user }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                                <User size={24} className="text-gray-500 dark:text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(selectedUser === user.id ? null : user.id);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                        </button>
                        {selectedUser === user.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 py-1">
                                <button
                                    onClick={() => { }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Trash2 size={14} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.phoneNumber ?? 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Age</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.age ?? 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Sex</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {user.sexe === 'male' ? 'Male' : user.sexe === 'female' ? 'Female' : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Blood Group</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {user.groupage ?? 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Showing </span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); 
                        }}
                        className="mx-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>of {filteredUsers.length} users</span>
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${currentPage === 1
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronsLeft size={16} />
                    </button>

                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${currentPage === 1
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => paginate(1)}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <span className="w-5 h-5 flex items-center justify-center text-sm">1</span>
                            </button>
                            {startPage > 2 && (
                                <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                            )}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`p-2 rounded-md w-8 h-8 flex items-center justify-center ${currentPage === number
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => paginate(totalPages)}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <span className="w-5 h-5 flex items-center justify-center text-sm">{totalPages}</span>
                            </button>
                        </>
                    )}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${currentPage === totalPages
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronRight size={16} />
                    </button>

                    <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${currentPage === totalPages
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-full">
            <div className="mb-4 md:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                    <span>Manage Users</span>
                    <span className="text-sm font-normal py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                        {filteredUsers.length} users | Page {currentPage} of {totalPages}
                    </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    View and manage all registered users
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-3 py-2 text-sm ${viewMode === "table"
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-2 text-sm ${viewMode === "grid"
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                Grid
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading users...</div>
            )}
            {error && (
                <div className="text-center py-12 text-red-600 dark:text-red-400">{error}</div>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter to find what you're looking for
                    </p>
                </div>
            )}

            {!loading && !error && filteredUsers.length > 0 && (
                <>
                    {viewMode === "table" ? (
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                        <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                            Email
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
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
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                                            <User size={16} className="text-gray-500 dark:text-gray-400 sm:hidden" />
                                                            <User size={20} className="text-gray-500 dark:text-gray-400 hidden sm:block" />
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
                                                {user.phoneNumber ?? 'N/A'}
                                            </td>
                                            <td className="px-3 sm:px-6 text-center py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                                                {user.age ?? 'N/A'}
                                            </td>
                                            <td className="px-3 sm:px-6 text-center py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell capitalize">
                                                {user.sexe ?? 'N/A'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-center whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                                                {user.groupage ?? 'N/A'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-1 sm:space-x-3">
                                                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Trash2 size={16} className="sm:hidden" />
                                                        <Trash2 size={18} className="hidden sm:block" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {currentUsers.map((user) => (
                                <UserCardView key={user.id} user={user} />
                            ))}
                        </div>
                    )}

                    <Pagination />
                </>
            )}
        </div>
    );
}