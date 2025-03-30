import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  User,
  Filter,
  Search,
} from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Sarah Johnson",
      date: "2024-02-20",
      time: "09:00 AM",
      type: "Video Call",
      status: "Upcoming",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      symptoms: "Headache and fever",
      duration: "30 mins",
    },
    {
      id: 2,
      patientName: "Michael Brown",
      date: "2024-02-20",
      time: "10:30 AM",
      type: "In Person",
      status: "Completed",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      symptoms: "Regular checkup",
      duration: "45 mins",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      date: "2024-02-20",
      time: "02:00 PM",
      type: "Chat",
      status: "Upcoming",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      symptoms: "Back pain",
      duration: "30 mins",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  const filterAppointments = (status) => {
    setActiveFilter(status);
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your appointments and schedule
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => filterAppointments("all")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => filterAppointments("upcoming")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "upcoming"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => filterAppointments("completed")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={appointment.image}
                  alt={appointment.patientName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {appointment.patientName}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.duration}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {appointment.symptoms}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === "Upcoming"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {appointment.status}
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                    View Details
                  </button>
                  {appointment.status === "Upcoming" && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Start Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}