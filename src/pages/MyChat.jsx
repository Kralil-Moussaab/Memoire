import { useState, useEffect, useRef } from "react";
import { Phone, Video, Circle, ArrowLeft, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDoctorSaved, getDoctorChat } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import docImage from "../assets/doc.png";

export default function MyChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorList, setShowDoctorList] = useState(true);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchOnlineDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await getDoctorSaved();

        if (response && response.data && response.data.session) {
          const sessions = response.data.session.map((session) => ({
            id: session.doctor.id,
            sessionId: session.id,
            name: session.doctor.name || "Unknown Doctor",
            specialty: session.doctor.speciality || "Specialist",
            image: session.doctor.picture
              ? `http://localhost:8000/storage/${session.doctor.picture}`
              : docImage,
            status: session.doctor.status,
            email: session.doctor.email,
            phoneNumber: session.doctor.phone_number,
            city: session.doctor.city,
            street: session.doctor.street,
            rating: session.doctor.rating,
            approved: session.doctor.approved,
            startAt: session.start_at,
            endedAt: session.ended_at,
            createdAt: session.created_at,
            updatedAt: session.updated_at,
          }));

          setOnlineDoctors(sessions);
        } else {
          console.error(
            "Invalid response format from getDoctorSaved:",
            response
          );
          setOnlineDoctors([]);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setOnlineDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchOnlineDoctors();
  }, [user]);

  const handleStartChat = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorList(false);
    setLoadingMessages(true);

    try {
      const response = await getDoctorChat(doctor.sessionId);

      if (Array.isArray(response)) {
        const formattedMessages = response.map((msg) => ({
          id: msg.id,
          sender: msg.sender_type,
          message: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setChatMessages(formattedMessages);
      } else {
        console.error("Invalid response format from getDoctorChat:", response);
        setChatMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      setChatMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
    setShowDoctorList(true);
    setChatMessages([]);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 max-w-7xl">
        {/* Mobile Header */}
        <div className="mb-4 sm:mb-6 md:hidden">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {selectedDoctor ? selectedDoctor.name : "My Chats"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
          {/* Doctor List Panel */}
          <div
            className={`lg:col-span-4 xl:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
              !showDoctorList && "hidden lg:block"
            }`}
          >
            <div className="p-4 sm:p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  Doctors
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-2">
                {loadingDoctors ? (
                  <div className="flex flex-col items-center justify-center h-32 space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading doctors...
                    </p>
                  </div>
                ) : onlineDoctors.length > 0 ? (
                  onlineDoctors.map((doctor, index) => (
                    <div
                      key={`${doctor.id}-${doctor.sessionId}`}
                      className="group relative dark rounded-xl p-3 sm:p-2 border-gray-300 dark:border-gray-600 hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-650 transition-all duration-300 cursor-pointer border hover:border-blue-200 dark:hover:border-blue-700"
                      onClick={() => handleStartChat(doctor)}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-1 ring-blue-100 dark:ring-gray-600 group-hover:ring-blue-300 transition-all"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = docImage;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-400 truncate text-sm sm:text-base">
                            {doctor.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {doctor.specialty}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(doctor.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {doctor.rating}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Session:{" "}
                            {new Date(doctor.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowLeft className="w-4 h-4 text-blue-500 transform rotate-180" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No chat sessions available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div
            className={`lg:col-span-8 xl:col-span-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
              showDoctorList && !selectedDoctor && "hidden lg:block"
            }`}
          >
            {!selectedDoctor ? (
              <div className="h-full flex items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Select a doctor to view chat
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Choose from your saved doctors to view chat history
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <button
                        onClick={handleBackToList}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                          <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-1 ring-blue-200 dark:ring-gray-600"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg">
                            {selectedDoctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedDoctor.specialty}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors hidden sm:block">
                        <Phone size={18} />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors hidden sm:block">
                        <Video size={18} />
                      </button>
                      <button
                        onClick={handleBackToList}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
                      >
                        <PhoneOff size={14} className="mr-1.5" />
                        <span className="hidden sm:inline">Close</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                >
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Circle className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No messages yet
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        Start a conversation with {selectedDoctor.name}
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        } ${index === 0 ? "mt-4" : ""}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
                          }`}
                        >
                          <p className="break-words text-sm sm:text-base leading-relaxed">
                            {message.message}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-blue-100"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
