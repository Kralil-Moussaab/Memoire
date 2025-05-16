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
} from "recharts";
import { getAdminStats } from "../../services/api";

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

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const response = await getAdminStats();
                if (response.success) {
                    const { totalUser, totalDoctor, totalAppointment } = response.data;
                    const updatedStats = [
                        {
                            title: "Total Users",
                            value: totalUser.toString(),
                            icon: <Users className="h-6 w-6 text-blue-500" />,
                            change: "+12%", 
                            isIncrease: true,
                            bgGradient: "from-blue-500/20 to-transparent",
                            borderColor: "border-blue-500/30",
                        },
                        {
                            title: "Total Doctors",
                            value: totalDoctor.toString(),
                            icon: <Stethoscope className="h-6 w-6 text-green-500" />,
                            change: "+8%",
                            isIncrease: true,
                            bgGradient: "from-green-500/20 to-transparent",
                            borderColor: "border-green-500/30",
                        },
                        {
                            title: "Appointments",
                            value: totalAppointment.toString(),
                            icon: <Calendar className="h-6 w-6 text-purple-500" />,
                            change: "-3%",
                            isIncrease: false,
                            bgGradient: "from-purple-500/20 to-transparent",
                            borderColor: "border-purple-500/30",
                        },
                        {
                            title: "Growth Rate",
                            value: "15.2%",
                            icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
                            change: "+2.3%",
                            isIncrease: true,
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

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    {loading ? (
                        Array(4).fill(0).map((_, index) => (
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
                                        <div
                                            className={`flex items-center ${stat.isIncrease ? "text-green-500" : "text-red-500"} bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm`}
                                        >
                                            {stat.isIncrease ? (
                                                <ArrowUp className="h-3 w-3" />
                                            ) : (
                                                <ArrowDown className="h-3 w-3" />
                                            )}
                                            <span className="ml-1 text-xs font-medium">{stat.change}</span>
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
                                User Growth
                            </h3>
                            <div className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
                                +12% this month
                            </div>
                        </div>
                        <div className="h-72 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                                    <YAxis tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            borderColor: '#E5E7EB',
                                            borderRadius: '0.375rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#FFFFFF', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Doctor Growth
                            </h3>
                            <div className="text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                                +8% this month
                            </div>
                        </div>
                        <div className="h-72 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={doctorGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                                    <YAxis tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            borderColor: '#E5E7EB',
                                            borderRadius: '0.375rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="doctors"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: '#FFFFFF' }}
                                        activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}