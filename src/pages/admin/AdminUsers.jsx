import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ChevronDown,
    Trash2,
    Edit,
    Plus,
    MoreVertical,
    X,
} from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            status: "Active",
            joinDate: "2024-01-15",
            appointments: 12,
            image: "https://randomuser.me/api/portraits/men/5.jpg",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            status: "Active",
            joinDate: "2024-02-01",
            appointments: 8,
            image: "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            status: "Inactive",
            joinDate: "2024-01-20",
            appointments: 5,
            image: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 4,
            name: "Sarah Williams",
            email: "sarah@example.com",
            status: "Active",
            joinDate: "2024-03-05",
            appointments: 15,
            image: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
            id: 5,
            name: "Alex Rodriguez",
            email: "alex@example.com",
            status: "Inactive",
            joinDate: "2024-02-20",
            appointments: 3,
            image: "https://randomuser.me/api/portraits/men/2.jpg",
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [viewMode, setViewMode] = useState("table");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStatusDropdown) setShowStatusDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showStatusDropdown]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleStatusToggle = (userId) => {
        setUsers(
            users.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        status: user.status === "Active" ? "Inactive" : "Active",
                    }
                    : user
            )
        );
    };

    const handleStatusClick = (e, status) => {
        e.stopPropagation();
        setStatusFilter(status);
        setShowStatusDropdown(false);
    };

    const UserCardView = ({ user }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={user.image}
                                alt={user.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                            <div
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${user.status === "Active"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                            ></div>
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
                                    onClick={() => {/* Edit logic */ }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Edit size={14} className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleStatusToggle(user.id)}
                                    className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <div
                                        className={`h-3 w-3 rounded-full mr-2 ${user.status === "Active" ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    ></div>
                                    {user.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
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
                        <p className="text-gray-500 dark:text-gray-400">Joined</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.joinDate}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Appointments</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.appointments}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <span>Manage Users</span>
                    <span className="ml-3 text-sm font-normal py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                        {filteredUsers.length} users
                    </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    View and manage all registered users
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowStatusDropdown(!showStatusDropdown);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <Filter size={18} />
                                <span className="capitalize">
                                    {statusFilter === "all" ? "All Status" : statusFilter}
                                </span>
                                <ChevronDown size={16} />
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                                    <div className="py-1">
                                        {["all", "active", "inactive"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={(e) => handleStatusClick(e, status)}
                                                className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${statusFilter === status
                                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                        : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`h-2 w-2 rounded-full mr-2 ${status === "active"
                                                            ? "bg-green-500"
                                                            : status === "inactive"
                                                                ? "bg-red-500"
                                                                : "bg-gray-400"
                                                        }`}
                                                ></div>
                                                <span className="capitalize">{status === "all" ? "All Status" : status}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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

            {filteredUsers.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter to find what you're looking for
                    </p>
                </div>
            ) : viewMode === "table" ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                        Join Date
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                        Appointments
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                        src={user.image}
                                                        alt={user.name}
                                                    />
                                                    <div
                                                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white dark:border-gray-800 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    ></div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusToggle(user.id)}
                                                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full transition-colors ${user.status === "Active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                                    }`}
                                            >
                                                {user.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                                            {user.joinDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                                            {user.appointments}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUsers.map((user) => (
                        <UserCardView key={user.id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}