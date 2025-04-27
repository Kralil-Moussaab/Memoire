import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  MessageSquare,
  Video,
  Filter,
  Search,
  ChevronDown,
  Award,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { getAppointmentsByUser } from "../services/api";
import { Message } from "../shared/Message";

export default function AppointmentUser() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;

      try {
        const response = await getAppointmentsByUser(user.id);
        if (response.success && response.data) {
          setAppointments(response.data);
        } else {
          setError(response.error || "Failed to fetch appointments");
          setAppointments([]); 
        }
      } catch (err) {
        setError("Failed to load appointments. Please try again later.");
        console.error("Error fetching appointments:", err);
        setAppointments([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  const filterAppointments = (status) => {
    setActiveFilter(status);
  };

  const filteredAppointments = (appointments || []).filter((appointment) => {
    if (!appointment) return false;
    
    const matchesFilter =
      activeFilter === "all" ||
      (appointment.status && appointment.status.toLowerCase() === activeFilter.toLowerCase());
    
    const doctorName = appointment.doctor?.name?.toLowerCase() || "";
    const doctorSpeciality = appointment.doctor?.speciality?.toLowerCase() || "";
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch =
      doctorName.includes(searchLower) ||
      doctorSpeciality.includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {error && (
          <Message type="error" message={error} onClose={() => setError("")} />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Appointments
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => filterAppointments("all")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeFilter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => filterAppointments("scheduled")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeFilter === "scheduled"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => filterAppointments("completed")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeFilter === "completed"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>

        {!appointments?.length ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any appointments scheduled at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className={`h-2 w-full ${
                  appointment.status === "scheduled" 
                    ? "bg-gradient-to-r from-green-400 to-green-500" 
                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                }`}></div>
                
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {appointment.doctor?.name}
                          </h3>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-blue-500 mr-1" />
                            <p className="text-gray-600 dark:text-gray-300">
                              {appointment.doctor?.speciality}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "scheduled"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>   
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-blue-500" />
                          </div>
                          <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-blue-500" />
                          </div>
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-blue-500" />
                          </div>
                          <span>
                            {appointment.doctor?.city}, {appointment.doctor?.street}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                            <Phone className="w-4 h-4 text-blue-500" />
                          </div>
                          <span>{appointment.doctor?.phone_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}