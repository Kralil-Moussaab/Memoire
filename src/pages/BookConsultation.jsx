import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  Building2,
  Stethoscope,
  X,
} from "lucide-react";
import { getAppointmentSlotsById, approveAppointment } from "../services/api";
import { Message } from "../shared/Message";
import { useAuth } from "../contexts/AuthContext";
import defaultDoctorImage from "../assets/doc.png";

export default function BookConsultation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(false);

  useEffect(() => {
    const doctorData = location.state?.doctor;
    if (!doctorData) {
      navigate("/find");
      return;
    }
    setDoctor(doctorData);
    fetchAppointmentSlots(doctorData.id);
  }, []);

  const fetchAppointmentSlots = async (doctorId) => {
    setLoading(true);
    try {
      const response = await getAppointmentSlotsById(doctorId);
      if (response && response.data) {
        setAvailableSlots(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch appointment slots:", err);
      setError("Failed to load available slots. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDate || !selectedTime || !user?.id) return;

    setLoadingAppointment(true);
    setError(null);

    try {
      const slotsResponse = await getAppointmentSlotsById(doctor.id);
      if (!slotsResponse.success || !slotsResponse.data) {
        throw new Error("Failed to fetch appointment details");
      }

      const appointment = slotsResponse.data.find(
        (app) => app.date === selectedDate && app.time === selectedTime
      );

      if (!appointment) {
        throw new Error("Appointment slot not found");
      }

      const result = await approveAppointment(appointment.id, user.id);

      if (result.success) {
        setSuccess("Appointment booked successfully!");
        setShowConfirmationModal(false);
        const updatedSlots = await getAppointmentSlotsById(doctor.id);
        if (updatedSlots.success && updatedSlots.data) {
          setAvailableSlots(updatedSlots.data);
        }
      } else {
        setError(result.error || "Failed to book appointment");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while booking the appointment"
      );
      console.error("Appointment booking error:", err);
    } finally {
      setLoadingAppointment(false);
    }
  };

  const getDoctorImage = (doctor) => {
    if (doctor?.picture) {
      return doctor.picture;
    }
    return defaultDoctorImage;
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

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        {error && (
          <Message
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        {success && (
          <Message
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={getDoctorImage(doctor)}
                      alt={doctor.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Dr. {doctor.name}
                    </h1>
                    <p className="text-blue-100 text-lg mb-3">
                      {doctor.specialty}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1" />
                        {doctor.specialty}
                      </div>
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {doctor.clinic}
                      </div>
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm">
                        {doctor.gender}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Book Appointment
              </h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  Object.entries(groupSlotsByDate(availableSlots)).map(
                    ([date, times], index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-3">
                          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {date}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {times.map((time, timeIndex) => (
                            <button
                              key={timeIndex}
                              onClick={() => {
                                handleDateSelect(date);
                                handleTimeSelect(time);
                              }}
                              className={`flex items-center justify-center px-3 py-2 border rounded-lg transition-colors ${
                                selectedDate === date && selectedTime === time
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <Clock className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="text-sm">{time}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No appointment slots available
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {showConfirmationModal && (
          <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirm Appointment
                </h3>
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{selectedTime}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAppointment}
                  disabled={loadingAppointment}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                    loadingAppointment ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingAppointment ? "Confirming..." : "Confirm Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
