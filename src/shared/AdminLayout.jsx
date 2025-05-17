import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
    ChevronRight,
    ChevronLeft,
    LayoutDashboard,
    Users,
    UserCog,
    LogOut,
    Search,
    Bell,
    Stethoscope,
    Menu,
    Sun, 
    Moon,
    X
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Stethoscope, label: "Doctors", path: "/admin/doctors" },
    { icon: Users, label: "Users", path: "/admin/users" },
];

const adminUser = {
    name: "Admin",
    role: "Administrator"
};

export default function AdminLayout() {
    const { logoutAdmin } = useAuth();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    useEffect(() => {
        if (windowWidth < 768) {
            setSidebarCollapsed(true);
            setMobileSidebarOpen(false);
        }
    }, [windowWidth]);

    const handleLogout = async () => {
        await logoutAdmin();
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {isMobileSidebarOpen && windowWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            <aside
                className={`
          fixed left-0 top-0 z-50
          h-screen transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 shadow-lg
          ${windowWidth >= 768
                        ? (isSidebarCollapsed ? "w-20" : "w-64")
                        : (isMobileSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full")
                    }
        `}
            >
                <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
                    {(!isSidebarCollapsed || (windowWidth < 768 && isMobileSidebarOpen)) && (
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    )}

                    {windowWidth >= 768 ? (
                        <button
                            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                        >
                            {isSidebarCollapsed ? (
                                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={toggleMobileSidebar}
                            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                </div>

                <div className="px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
                    <div className="flex items-center mb-8 p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <UserCog className="w-6 h-6 text-white" />
                        </div>
                        {(!isSidebarCollapsed || (windowWidth < 768 && isMobileSidebarOpen)) && (
                            <div className="ml-3">
                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                    {adminUser.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {adminUser.role}
                                </p>
                            </div>
                        )}
                    </div>

                    <nav className="flex flex-col flex-grow space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                    ${isActive
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        }
                  `}
                                >
                                    <link.icon
                                        className={`h-5 w-5 ${(isSidebarCollapsed && windowWidth >= 768) ? "mx-auto" : ""}`}
                                    />
                                    {(!isSidebarCollapsed || (windowWidth < 768 && isMobileSidebarOpen)) && <span>{link.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                        >
                            <LogOut
                                className={`h-5 w-5 ${(isSidebarCollapsed && windowWidth >= 768) ? "mx-auto" : ""}`}
                            />
                            {(!isSidebarCollapsed || (windowWidth < 768 && isMobileSidebarOpen)) && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${windowWidth >= 768 ? (isSidebarCollapsed ? "ml-20" : "ml-64") : "ml-0"
                    }`}
            >
                <header className="h-16 sticky top-0 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 z-40">
                    {windowWidth < 768 && (
                        <button
                            onClick={toggleMobileSidebar}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                        onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                            {isDarkMode ? (
                                <Sun className="text-yellow-500" size={20} />
                            ) : (
                                <Moon className="text-gray-700 dark:text-gray-300" size={20} />
                            )}                        </button>
                        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>
                    </div>
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}