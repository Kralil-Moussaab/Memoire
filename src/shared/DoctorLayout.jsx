import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCog,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import defaultDoctorImage from "../assets/doc.png";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/doctor/dashboard" },
  { icon: CalendarDays, label: "Appointments", path: "/doctor/appointments" },
  { icon: MessageSquare, label: "Chat", path: "/doctor/chat" },
  { icon: Users, label: "My Patients", path: "/doctor/patients" },
  { icon: UserCog, label: "Profile Settings", path: "/doctor/profile" },
];

export default function DoctorLayout() {
  const { user, logout, loading } = useAuth();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
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
    if (windowWidth < 768) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [windowWidth]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.approved === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Waiting for Approval
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your account is pending approval. Please wait while we review your
            application.
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const getDoctorImage = () => user?.picture || defaultDoctorImage;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 h-screen transition-all duration-300 ease-in-out fixed left-0 top-0 z-30`}
      >
        <div className="h-20 flex items-center justify-between px-4">
          {!isSidebarCollapsed && (
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Med-Link
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        <div className="px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
          <div className="flex items-center mb-8">
            <img
              src={getDoctorImage()}
              alt={user?.name}
              className={`rounded-full object-cover ${
                isSidebarCollapsed ? "w-10 h-10" : "w-16 h-16"
              }`}
            />
            {!isSidebarCollapsed && (
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  Dr. {user?.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.speciality}
                </p>
              </div>
            )}
          </div>

          <nav className="flex flex-col flex-grow space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 text-gray-700 dark:text-gray-300 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  location.pathname === link.path
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <link.icon
                  className={`h-6 w-6 ${isSidebarCollapsed ? "mx-auto" : ""}`}
                />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-1 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex cursor-pointer items-center space-x-3 text-red-500 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut
                className={`h-6 w-6 ${isSidebarCollapsed ? "mx-auto" : ""}`}
              />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 ease-in-out`}
      >
        <header className="h-20 sticky top-0 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6 z-40">
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
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
