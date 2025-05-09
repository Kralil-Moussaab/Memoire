import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getDoctorById,
  getAppointmentSlotsById,
  approveAppointment,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Star,
  Calendar,
  Clock,
  Award,
  Users,
  MessageSquare,
  Video,
  CheckCircle,
  Stethoscope,
  Building2,
  X,
} from "lucide-react";
import { Message } from "../shared/Message";
import defaultDoctorImage from "../assets/doc.png";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorResponse, slotsResponse] = await Promise.all([
          getDoctorById(id),
          getAppointmentSlotsById(id),
        ]);

        if (doctorResponse && doctorResponse.data) {
          setDoctor(doctorResponse.data);
        }

        if (slotsResponse && slotsResponse.data) {
          setAppointmentSlots(slotsResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    navigate(`/find${page ? `?page=${page}` : ""}`);
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

  const handleBookAppointment = (slot) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setSelectedSlot(slot);
    setShowConfirmationModal(true);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedSlot || !user?.id) return;

    setLoadingAppointment(true);
    setAppointmentError("");

    try {
      const slotsResponse = await getAppointmentSlotsById(id);
      if (!slotsResponse.success || !slotsResponse.data) {
        throw new Error("Failed to fetch appointment details");
      }

      const appointment = slotsResponse.data.find(
        (app) =>
          app.date === selectedSlot.date && app.time === selectedSlot.time
      );

      if (!appointment) {
        throw new Error("Appointment slot not found");
      }

      const result = await approveAppointment(appointment.id, user.id);

      if (result.success) {
        setAppointmentSuccess("Appointment booked successfully!");
        setShowConfirmationModal(false);
        const updatedSlots = await getAppointmentSlotsById(id);
        if (updatedSlots.success && updatedSlots.data) {
          setAppointmentSlots(updatedSlots.data);
        }
      } else {
        setAppointmentError(result.error || "Failed to book appointment");
      }
    } catch (error) {
      setAppointmentError(
        error.message || "An error occurred while booking the appointment"
      );
      console.error("Appointment booking error:", error);
    } finally {
      setLoadingAppointment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Message type="error" message={error} onClose={() => setError("")} />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-gray-600 dark:text-gray-400">Doctor not found</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      label: "Patients",
      value: "1000+",
    },
    {
      icon: <Award className="w-5 h-5 text-blue-500" />,
      label: "Experience",
      value: "10+ Years",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      label: "Reviews",
      value: "500+",
    },
    {
      icon: <Star className="w-5 h-5 text-blue-500" />,
      label: "Rating",
      value: `${doctor.rating}/5`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Doctors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="profile-image-container">
                      <img
                        src={getDoctorImage(doctor)}
                        alt={doctor?.name || "Doctor"}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {doctor.name}
                    </h1>
                    <p className="text-blue-100 text-lg mb-3">
                      {doctor.speciality}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1" />
                        {doctor.speciality}
                      </div>
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {doctor.formations}
                      </div>
                      <div className="bg-blue-400/20 text-white px-3 py-1 rounded-full text-sm">
                        {doctor.gender}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-3 cursor-pointer text-sm font-medium border-b-2 ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("experience")}
                    className={`px-6 py-3 cursor-pointer text-sm font-medium border-b-2 ${
                      activeTab === "experience"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-6 py-3 cursor-pointer text-sm font-medium border-b-2 ${
                      activeTab === "reviews"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        About
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {doctor.localisation || "No description available"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Mail className="w-5 h-5 mr-3 text-blue-500" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Phone className="w-5 h-5 mr-3 text-blue-500" />
                          <span>{doctor.phoneNumber}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                          <span>
                            {doctor.street}, {doctor.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Consultation Types
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Video className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Video Consultation
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Available for online meetings
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Users className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              In-Person Visit
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Available at clinic
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Education & Training
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {doctor.formations}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              2010 - 2015
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Patient Reviews
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {doctor.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      No reviews available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Book Appointment
              </h2>
              <div className="space-y-6">
                {appointmentSlots.length > 0 ? (
                  Object.entries(groupSlotsByDate(appointmentSlots)).map(
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
                              onClick={() =>
                                handleBookAppointment({
                                  date,
                                  time,
                                  id: timeIndex,
                                })
                              }
                              className="flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              <Clock className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                                {time}
                              </span>
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

              {appointmentError && (
                <Message
                  type="error"
                  message={appointmentError}
                  onClose={() => setAppointmentError("")}
                />
              )}

              {appointmentSuccess && (
                <Message
                  type="success"
                  message={appointmentSuccess}
                  onClose={() => setAppointmentSuccess("")}
                />
              )}

              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{selectedSlot?.date}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{selectedSlot?.time}</span>
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
