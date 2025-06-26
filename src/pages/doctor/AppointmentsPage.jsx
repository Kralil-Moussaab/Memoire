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
  Mail,
  Phone,
  Heart,
  Droplets,
} from "lucide-react";
import { Message } from "../../shared/Message";
import {
  addAppointmentSlots,
  getAppointmentSlotsById,
  getApproveAppointment,
  deletAppointment,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [showDeleteSlotModal, setShowDeleteSlotModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(false);

  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await getApproveAppointment();

        if (response.success && response.data) {
          if (
            !response.data.appointments ||
            !Array.isArray(response.data.appointments)
          ) {
            console.error("Invalid appointments data format");
            setError("Invalid appointments data format");
            return;
          }

          const formattedAppointments = response.data.appointments.map(
            (appointment) => {
              return {
                id: appointment.id,
                patientName: appointment.user?.name || "Unknown Patient",
                date: appointment.date,
                time: appointment.time,
                status: "Upcoming",
                email: appointment.user?.email || "No email provided",
                phoneNumber:
                  appointment.user?.phone_number || "No phone provided",
                chronicDisease: appointment.user?.chronic_disease || "no chronic disease",
                groupage: appointment.user?.groupage || "no blood type ",
              };
            }
          );

          setAppointments(formattedAppointments);
        } else {
          console.error("API Error Response:", response);
          setError(response.error || "Failed to load appointments");
        }
      } catch (err) {
        console.error("Error in fetchApprovedAppointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchApprovedAppointments();
  }, []);

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

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter =
      activeFilter === "all" ||
      appointment.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const handleDeleteSlot = (slot) => {
    setSlotToDelete(slot);
    setShowDeleteSlotModal(true);
  };

  const confirmDeleteSlot = async () => {
    if (!slotToDelete) return;

    setDeletingSlot(true);
    setError("");

    try {
      const result = await deletAppointment(slotToDelete.id);

      if (result.success) {
        setAvailableSlots(availableSlots.filter(slot => slot.id !== slotToDelete.id));
        setSuccess("Slot deleted successfully!");
        setShowDeleteSlotModal(false);
        setSlotToDelete(null);
      } else {
        setError(result.error || "Failed to delete slot");
      }
    } catch (error) {
      setError("An error occurred while deleting the slot");
      console.error(error);
    } finally {
      setDeletingSlot(false);
    }
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
                availableSlots.map((slot, index) => (
                  <div
                    key={slot.id || index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(slot.date).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Delete this slot"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center shadow-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {slot.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No available slots found
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">

          <div className="space-y-4">
            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Loading appointments...
                </p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-5 w-full sm:flex-1">
                      <div className="relative">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center ring-4 ring-blue-50 dark:ring-blue-900/20 shadow-sm">
                          <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex flex-row sm:items-center justify-evenly sm:justify-between gap-2">
                          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            {appointment.patientName}
                          </h3>
                          <span
                            className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-sm font-medium ${
                              appointment.status === "Upcoming"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mt-2">
                          {/* Medical Information Pills */}
                          <div className="flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg shadow-sm">
                            <Droplets className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Blood Group: {appointment.groupage}
                            </span>
                          </div>
                          
                          <div className="flex items-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg shadow-sm">
                            <Heart className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Chronic Disease: {appointment.chronicDisease}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-2 mt-2">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Mail className="w-5 h-5 mr-3 text-blue-400" />
                            <span className="text-sm font-medium">
                              {appointment.email}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Phone className="w-5 h-5 mr-3 text-blue-400" />
                            <span className="text-sm font-medium">
                              {appointment.phoneNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-center sm:justify-normal sm:items-normal flex-wrap gap-2 mt-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 sm:px-4 py-2 rounded-xl shadow-sm">
                            <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                            <span className="text-sm font-medium">
                              {new Date(appointment.date).toLocaleDateString(
                                "en-GB"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 sm:px-4 py-2 rounded-xl shadow-sm">
                            <Clock className="w-5 h-5 mr-2 text-blue-400" />
                            <span className="text-sm font-medium">
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Appointments Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You don't have any appointments scheduled at the moment.
                </p>
              </div>
            )}
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

      {showDeleteSlotModal && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 border-1 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Delete Slot
              </h3>
              <button
                onClick={() => {
                  setShowDeleteSlotModal(false);
                  setSlotToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this available slot?
              </p>
              
              {slotToDelete && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(slotToDelete.date).toLocaleDateString("en-GB")}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{slotToDelete.time}</span>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-red-600 dark:text-red-400">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteSlotModal(false);
                  setSlotToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSlot}
                disabled={deletingSlot}
                className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                  deletingSlot ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {deletingSlot ? "Deleting..." : "Delete Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}