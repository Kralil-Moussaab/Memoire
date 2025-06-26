import { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Bell,
  Settings,
  Menu,
  X,
  Home,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  getAdminStats,
  getSpecialtyData,
  getAgeData,
} from "../../services/api";

const userGrowthData = [
  { name: "Jan", users: 65 },
  { name: "Feb", users: 85 },
  { name: "Mar", users: 75 },
  { name: "Apr", users: 95 },
  { name: "May", users: 115 },
  { name: "Jun", users: 105 },
];

const doctorGrowthData = [
  { name: "Jan", doctors: 24 },
  { name: "Feb", doctors: 36 },
  { name: "Mar", doctors: 32 },
  { name: "Apr", doctors: 45 },
  { name: "May", doctors: 52 },
  { name: "Jun", doctors: 48 },
];

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialtyData, setSpecialtyData] = useState([]);
  const [loadingSpecialty, setLoadingSpecialty] = useState(true);
  const [ageData, setAgeData] = useState([]);
  const [loadingAge, setLoadingAge] = useState(true);

  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
    "#E67E22",
    "#2ECC71",
    "#F1C40F",
    "#1ABC9C",
  ];

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        if (response.success) {
          const { totalUser, totalDoctor, totalAppointment, amount } =
            response.data;
          const updatedStats = [
            {
              title: "Total Users",
              value: totalUser.toString(),
              icon: <Users className="h-6 w-6 text-blue-500" />,
              bgGradient: "from-blue-500/20 to-transparent",
              borderColor: "border-blue-500/30",
            },
            {
              title: "Total Doctors",
              value: totalDoctor.toString(),
              icon: <Stethoscope className="h-6 w-6 text-green-500" />,
              bgGradient: "from-green-500/20 to-transparent",
              borderColor: "border-green-500/30",
            },
            {
              title: "Appointments",
              value: totalAppointment.toString(),
              icon: <Calendar className="h-6 w-6 text-purple-500" />,
              bgGradient: "from-purple-500/20 to-transparent",
              borderColor: "border-purple-500/30",
            },
            {
              title: "Revenue",
              value: Number(amount).toFixed(2),
              icon: <DollarSign className="h-6 w-6 text-orange-500" />,
              bgGradient: "from-orange-500/20 to-transparent",
              borderColor: "border-orange-500/30",
            },
          ];

          setStats(updatedStats);
        } else {
          setError("Failed to fetch stats");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  useEffect(() => {
    const fetchSpecialtyData = async () => {
      try {
        setLoadingSpecialty(true);
        const response = await getSpecialtyData();
        if (response.success) {
          const data = Object.entries(response.data).map(([name, value]) => ({
            name,
            value,
          }));
          setSpecialtyData(data);
        }
      } catch (err) {
        console.error("Error fetching specialty data:", err);
      } finally {
        setLoadingSpecialty(false);
      }
    };

    fetchSpecialtyData();
  }, []);

  useEffect(() => {
    const fetchAgeData = async () => {
      try {
        setLoadingAge(true);
        const response = await getAgeData();
        if (response.success) {
          const formattedData = [
            { name: "Kids (0-12)", value: response.data.kids },
            { name: "Teen (13-21)", value: response.data.teen },
            { name: "Adult (22-49)", value: response.data.adult },
            { name: "Olders (50-99)", value: response.data.olders },
          ];
          setAgeData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching age data:", err);
      } finally {
        setLoadingAge(false);
      }
    };

    fetchAgeData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-2"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              ))
          ) : error ? (
            <div className="col-span-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
              <p>Error: {error}</p>
              <button
                className="mt-2 text-sm font-medium underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border-l-4 ${stat.borderColor}`}
              >
                <div className={`bg-gradient-to-r ${stat.bgGradient} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                        {stat.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Doctors by Specialty
              </h3>
              <div className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
                Distribution
              </div>
            </div>
            <div className="h-72 sm:h-80">
              {loadingSpecialty ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={specialtyData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6B7280" }}
                      angle={-35}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      tickFormatter={(value) => {
                        if (value.length > 15) {
                          return value
                            .split(" ")
                            .map((word, i) =>
                              i % 2 === 0 ? word : word + "\n"
                            )
                            .join(" ");
                        }
                        return value;
                      }}
                    />
                    <YAxis tick={{ fill: "#6B7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E7EB",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} doctors`, "Count"]}
                    />
                    <Bar dataKey="value" fill="#4ECDC4" radius={[4, 4, 0, 0]}>
                      {specialtyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Age Distribution
              </h3>
              <div className="text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full">
                Patient Ages
              </div>
            </div>
            <div className="h-72 sm:h-80">
              {loadingAge ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#9B59B6"
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E7EB",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} patients`, "Count"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
