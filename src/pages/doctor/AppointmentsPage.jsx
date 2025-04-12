import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  User,
  Filter,
  Search,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { Message } from "../../shared/Message";
import {
  addAppointmentSlots,
  getAppointmentSlotsById,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AppointmentsPage() {
  const { user } = useAuth();
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
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    timeSlots: [""],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!user?.id) return;

      try {
        setLoadingSlots(true);
        const response = await getAppointmentSlotsById(user.id);
        if (response.success && response.data) {
          setAvailableSlots(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch available slots:", err);
        setError("Failed to load available slots. Please try again later.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [user?.id]);

  const filterAppointments = (status) => {
    setActiveFilter(status);
  };

  const handleAddTimeSlot = () => {
    setAppointmentData({
      ...appointmentData,
      timeSlots: [...appointmentData.timeSlots, ""],
    });
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = appointmentData.timeSlots.filter(
      (_, i) => i !== index
    );
    setAppointmentData({
      ...appointmentData,
      timeSlots: newTimeSlots,
    });
  };

  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...appointmentData.timeSlots];
    newTimeSlots[index] = value;
    setAppointmentData({
      ...appointmentData,
      timeSlots: newTimeSlots,
    });
  };

  const handleAddAppointment = async () => {
    if (
      !appointmentData.date ||
      appointmentData.timeSlots.some((slot) => !slot)
    ) {
      setError("Please fill in all appointment details");
      return;
    }

    if (!user?.id) {
      setError("Doctor ID not found. Please try logging in again.");
      return;
    }

    setLoading(true);

    try {
      const result = await addAppointmentSlots(user.id, {
        date: appointmentData.date,
        timeSlots: appointmentData.timeSlots,
      });

      if (result.success) {
        const slotsResponse = await getAppointmentSlotsById(user.id);
        if (slotsResponse.success && slotsResponse.data) {
          setAvailableSlots(slotsResponse.data);
        }

        setAppointmentData({ date: "", timeSlots: [""] });
        setShowAppointmentModal(false);
        setSuccess("Appointment slots added successfully!");
      } else {
        setError(result.error || "Failed to add appointment slots");
      }
    } catch (error) {
      setError("An error occurred while adding appointment slots");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = (id) => {
    setAvailableSlots(availableSlots.filter((slot) => slot.id !== id));
    setSuccess("Appointment slots deleted successfully!");
  };

  const groupSlotsByDate = (slots) => {
    return slots.reduce((grouped, slot) => {
      const date = slot.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot.time);
      return grouped;
    }, {});
  };

  return (
    <div className="p-5">
      {error && (
        <Message type="error" message={error} onClose={() => setError("")} />
      )}

      {success && (
        <Message
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your appointments and schedule
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Slots
              </h2>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Slots
              </button>
            </div>

            <div className="space-y-4">
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Loading slots...
                  </p>
                </div>
              ) : availableSlots.length > 0 ? (
                Object.entries(groupSlotsByDate(availableSlots)).map(
                  ([date, times], index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {date}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(date)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {times.map((time, timeIndex) => (
                          <span
                            key={timeIndex}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No available slots found
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
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
      </div>

      {showAppointmentModal && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 border-1 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Appointment Slots
              </h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Slots
                </label>
                {appointmentData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      value={slot}
                      onChange={(e) =>
                        handleTimeSlotChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {appointmentData.timeSlots.length > 1 && (
                      <button
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  className="mt-2 text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <Plus size={20} />
                  Add Time Slot
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                disabled={loading}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Adding..." : "Add Slots"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
