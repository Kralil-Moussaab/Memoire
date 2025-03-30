import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Star,
  DollarSign,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
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

const data = [
  { name: "Jan", patients: 65 },
  { name: "Feb", patients: 85 },
  { name: "Mar", patients: 75 },
  { name: "Apr", patients: 95 },
  { name: "May", patients: 115 },
  { name: "Jun", patients: 105 },
];

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 3600 },
  { name: "Mar", revenue: 3200 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 5200 },
  { name: "Jun", revenue: 4800 },
];

export default function DoctorDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: "+12%",
    },
    {
      title: "Consultations",
      value: "156",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      change: "+8%",
    },
    {
      title: "Rating",
      value: user?.rating || "4.8",
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      change: "+0.2",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: <DollarSign className="h-6 w-6 text-purple-500" />,
      change: "+15%",
    },
  ];

  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "09:00 AM",
      type: "Video Call",
      status: "Upcoming",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      patientName: "Michael Brown",
      time: "10:30 AM",
      type: "In Person",
      status: "Completed",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      time: "02:00 PM",
      type: "Chat",
      status: "Upcoming",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
                className={`text-sm ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Patient Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Patient Growth
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Appointments
          </h3>
          <button className="text-blue-500 hover:text-blue-600 flex items-center">
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="pb-4">Patient</th>
                <th className="pb-4">Time</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="py-4">
                    <div className="flex items-center">
                      <img
                        src={appointment.image}
                        alt={appointment.patientName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-gray-900 dark:text-white">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-gray-900 dark:text-white">
                      {appointment.type}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "Upcoming"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-500 hover:text-blue-600">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
