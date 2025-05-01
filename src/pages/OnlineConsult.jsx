import { useState, useEffect } from "react";
import { Send, Phone, Video, Clock, Circle, ArrowLeft, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsersById, discountJewels } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const onlineDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    status: "online",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    amount: 50,
  },
  {
    id: 2,
    name: "Dr. John Doe",
    specialty: "Dermatologist",
    status: "online",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    amount: 45,
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    specialty: "Pediatrician",
    status: "online",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    amount: 55,
  },
];

export default function OnlineConsult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(true);
  const [totalJewels, setTotalJewels] = useState(0);

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

    fetchUserBalance();
  }, [user]);

  const handleStartChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
    setShowDoctorList(false);
  };

  const handlePayment = async () => {
    if (totalJewels >= selectedDoctor.amount) {
      try {
        const response = await discountJewels({ amount: selectedDoctor.amount }); 
        if (response.success) {
          setTotalJewels(totalJewels - selectedDoctor.amount);
          setShowPayment(false);
          setMessages([
            {
              id: 1,
              sender: "doctor",
              text: `Hello! I'm Dr. ${selectedDoctor.name}. How can I help you today?`,
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
    setShowDoctorList(true);
    setMessages([]);
    setShowPayment(false);
  };

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
                {onlineDoctors.map((doctor) => (
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
                ))}
              </div>
            </div>
          </div>

          <div
            className={`md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${
              showDoctorList && !selectedDoctor && "hidden md:block"
            }`}
          >
            {!selectedDoctor ? (
              <div className="h-[600px] flex items-center justify-center p-4 sm:p-6">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a doctor to start consultation
                </p>
              </div>
            ) : showPayment ? (
              <div className="h-[600px] flex flex-col items-center justify-center p-4 sm:p-6">
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
                      Insufficient Jewels balance. You need {selectedDoctor.amount} Jewels.
                    </p>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Buy More Jewels
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-4">
                  <button
                    onClick={handleBackToList}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-white truncate">
                        {selectedDoctor.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedDoctor.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
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

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        <p className="break-words">{message.text}</p>
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
                </div>
                <form
                  onSubmit={sendMessage}
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
    </div>
  );
}
