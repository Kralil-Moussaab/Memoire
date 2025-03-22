import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Settings,
  ChevronRight,
  Star,
  DollarSign,
  Activity,
} from "lucide-react";

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      value: "4.8",
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
    },
    {
      id: 2,
      patientName: "Michael Brown",
      time: "10:30 AM",
      type: "In Person",
      status: "Completed",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      time: "02:00 PM",
      type: "Chat",
      status: "Upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, Dr. Smith
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your practice today
              </p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              View Profile
            </button>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Appointments
              </h2>
              <button className="text-blue-500 hover:text-blue-600 flex items-center">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "Upcoming"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {appointment.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Activity Overview
              </h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Patients Seen
                </span>
                <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  70%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Online Consults
                </span>
                <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  45%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction
                </span>
                <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  90%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
