import { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Video,
  Clock,
  Circle,
  ArrowLeft,
  Gem,
  Star,
  Save,
  Trash2,
  X,
  PhoneOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getUsersById,
  discountJewels,
  listDoctors,
  sendMessage,
  reviewDoctor,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Pusher from "pusher-js";
import { motion, AnimatePresence } from "framer-motion";

export default function OnlineConsult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(true);
  const [totalJewels, setTotalJewels] = useState(0);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (user && user.id) {
        const response = await getUsersById(user.id);
        if (response.success) {
          setTotalJewels(response.data.balance);
        } else {
          console.error("Failed to fetch user balance:", response.error);
        }
      }
    };

    const fetchOnlineDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const params = {
          status: "online",
        };

        const response = await listDoctors(params);
        if (response && response.data) {
          const specialtyPrices = {
            Cardiologist: 60,
            Neurologist: 60,
            Pediatrician: 58,
            Gynecologist: 56,
            Psychiatrist: 54,
            General: 52,
            Urologist: 50,
            Ophthalmologist: 48,
            Orthopedic: 46,
            ENT: 44,
            Dermatologist: 42,
            Dentistry: 40,
          };

          const formattedDoctors = response.data.map((doctor) => ({
            id: doctor.id,
            name: doctor.name || "Unknown Doctor",
            specialty: doctor.speciality || "General",
            image:
              doctor.picture ||
              "https://randomuser.me/api/portraits/lego/0.jpg",
            amount: specialtyPrices[doctor.speciality] || 52,
          }));

          setOnlineDoctors(formattedDoctors);
        } else {
          console.error("Invalid response format from listDoctors");
          setOnlineDoctors([]);
        }
      } catch (error) {
        console.error("Failed to fetch online doctors:", error);
        setOnlineDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchUserBalance();
    fetchOnlineDoctors();
  }, [user]);

  useEffect(() => {
    if (sessionId) {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      });

      const chatChannel = pusher.subscribe(`chat.${sessionId}`);

      chatChannel.bind("message", function (data) {
        const formattedMessage = {
          ...data,
          id: Date.now(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, formattedMessage]);
      });
      chatChannel.bind("ChatSessionEnded", function (data) {
        setShowRatingModal(true);
      });
      return () => {
        chatChannel.unsubscribe(`chat.${sessionId}`);
      };
    }
  }, [sessionId]);

  const handleStartChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
    setShowDoctorList(false);
  };

  const handlePayment = async () => {
    if (totalJewels >= selectedDoctor.amount) {
      try {
        const response = await discountJewels({
          amount: selectedDoctor.amount,
          doctorID: selectedDoctor.id,
        });
        if (response.success) {
          setTotalJewels(totalJewels - selectedDoctor.amount);
          setShowPayment(false);
          const newSessionId = response.data.session.id;
          setSessionId(newSessionId);
          localStorage.setItem("sessionId", newSessionId);
          setMessages([
            {
              id: 1,
              sender: "doctor",
              message: `Hello! I'm Dr. ${selectedDoctor.name}. How can I help you today?`,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        } else {
          console.error("Failed to deduct jewels:", response.error);
        }
      } catch (error) {
        console.error("Error during payment:", error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const response = await sendMessage(sessionId, newMessage);
      if (response.success) {
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            sender: "user",
            message: newMessage,
            time: currentTime,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setNewMessage("");
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
    setShowDoctorList(true);
    setMessages([]);
    setShowPayment(false);
    setSessionId(null);
    localStorage.removeItem("sessionId");
  };

  const handleEndChat = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    setShowRatingModal(false);
    setShowSaveModal(true);
  };

  const handleSaveChat = async (shouldSave) => {
    try {
      const response = await reviewDoctor(
        sessionId,
        rating,
        shouldSave ? "saved" : "discard"
      );
      if (response.success) {
        setShowSaveModal(false);
        handleBackToList();
      } else {
        console.error("Failed to save chat:", response.error);
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const RatingModal = () => (
    <AnimatePresence>
      {showRatingModal && (
        <motion.div className="fixed inset-0 backdrop-blur flex items-center  justify-center z-50">
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl border-1 border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Rate Your Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                How would you rate your consultation with Dr.{" "}
                {selectedDoctor?.name}?
              </p>
              <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-colors"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={!rating}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    rating
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SaveChatModal = () => (
    <AnimatePresence>
      {showSaveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border-1 border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4 relative"
          >
            <button
              onClick={handleCloseSaveModal}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Save Chat History?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Would you like to save this chat for future reference?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleSaveChat(true)}
                  className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Chat
                </button>
                <button
                  onClick={() => handleSaveChat(false)}
                  className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Chat
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gem className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Your Jewels Balance
              </span>
            </div>
            <button
              onClick={() => navigate("/jewels")}
              className="flex items-center space-x-2 group"
            >
              <Gem className="w-5 h-5 text-blue-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                {totalJewels}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${
              !showDoctorList && "hidden md:block"
            }`}
          >
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white">
                Online Doctors
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {loadingDoctors ? (
                  <div className="text-center p-4">Loading doctors...</div>
                ) : onlineDoctors.length > 0 ? (
                  onlineDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 dark:text-white truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-blue-500">
                          <Gem className="w-4 h-4" />
                          <span>{doctor.amount}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartChat(doctor)}
                        className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                      >
                        Chat
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    No online doctors available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${
              showDoctorList && !selectedDoctor && "hidden md:block"
            }`}
          >
            {!selectedDoctor ? (
              <div className="h-full flex items-center justify-center p-4 sm:p-6">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a doctor to start consultation
                </p>
              </div>
            ) : showPayment ? (
              <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6">
                <button
                  onClick={handleBackToList}
                  className="self-start mb-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
                >
                  <ArrowLeft size={24} />
                </button>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Start Consultation
                </h3>
                <div className="flex items-center space-x-2 mb-6">
                  <Gem className="w-6 h-6 text-blue-500" />
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    Consultation with Dr. {selectedDoctor.name} costs{" "}
                    {selectedDoctor.amount} Jewels
                  </span>
                </div>
                {totalJewels >= selectedDoctor.amount ? (
                  <button
                    onClick={handlePayment}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Gem className="w-5 h-5" />
                    <span>Pay {selectedDoctor.amount} Jewels</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-red-500 mb-4">
                      Insufficient Jewels balance. You need{" "}
                      {selectedDoctor.amount} Jewels.
                    </p>
                    <button
                      onClick={() => navigate("/jewels")}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Buy More Jewels
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleBackToList}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {selectedDoctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedDoctor.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <Phone
                        size={20}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <Video
                        size={20}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </button>
                  </div>
                </div>

                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        <p className="break-words">
                          {message.message || message.text}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t dark:border-gray-700"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <RatingModal />
      <SaveChatModal />
    </div>
  );
}
