import { useState, useEffect, useRef } from 'react';
import {
    Phone,
    Video,
    Circle,
    ArrowLeft,
    PhoneOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { listDoctors } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MyChat() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDoctorList, setShowDoctorList] = useState(true);
    const [onlineDoctors, setOnlineDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const chatContainerRef = useRef(null);

    const getSampleMessages = (doctorName) => [
        {
            id: 1,
            sender: 'doctor',
            message: `Hello! I'm Dr. ${doctorName}. How can I help you today?`,
            time: "09:00 AM"
        },
        {
            id: 2,
            sender: 'user',
            message: "Hi doctor, I've been having headaches for the past week.",
            time: "09:01 AM"
        },
        {
            id: 3,
            sender: 'doctor',
            message: "I understand. Could you tell me more about the headaches? Where exactly do you feel the pain?",
            time: "09:02 AM"
        },
        {
            id: 4,
            sender: 'user',
            message: "It's mostly in the front of my head and sometimes behind my eyes.",
            time: "09:03 AM"
        },
        {
            id: 5,
            sender: 'doctor',
            message: "Thank you for that information. Have you noticed any triggers for these headaches?",
            time: "09:04 AM"
        },
        {
            id: 6,
            sender: 'user',
            message: "They seem to get worse when I'm working on the computer.",
            time: "09:05 AM"
        },
        {
            id: 7,
            sender: 'doctor',
            message: "That's helpful to know. It sounds like you might be experiencing tension headaches. I recommend taking regular breaks from screen time and practicing some neck stretches.",
            time: "09:06 AM"
        }
    ];

    useEffect(() => {
        const fetchOnlineDoctors = async () => {
            setLoadingDoctors(true);
            try {
                const params = {
                    status: 'online',
                };

                const response = await listDoctors(params);
                if (response && response.data) {
                    const formattedDoctors = response.data.map((doctor) => ({
                        id: doctor.id,
                        name: doctor.name || 'Unknown Doctor',
                        specialty: doctor.speciality || 'Specialist',
                        image: doctor.picture || 'https://randomuser.me/api/portraits/lego/0.jpg',
                    }));

                    setOnlineDoctors(formattedDoctors);
                } else {
                    console.error('Invalid response format from listDoctors');
                    setOnlineDoctors([]);
                }
            } catch (error) {
                console.error('Failed to fetch online doctors:', error);
                setOnlineDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchOnlineDoctors();
    }, [user]);

    const handleStartChat = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDoctorList(false);
        setChatMessages(getSampleMessages(doctor.name));
    };

    const handleBackToList = () => {
        setSelectedDoctor(null);
        setShowDoctorList(true);
        setChatMessages([]);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${!showDoctorList && 'hidden md:block'}`}>
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
                                            </div>
                                            <button
                                                onClick={() => handleStartChat(doctor)}
                                                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                                            >
                                                View Chat
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

                    <div className={`md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${showDoctorList && !selectedDoctor && 'hidden md:block'}`}>
                        {!selectedDoctor ? (
                            <div className="h-full flex items-center justify-center p-4 sm:p-6">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Select a doctor to view chat history
                                </p>
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
                                        <button
                                            onClick={handleBackToList}
                                            className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <PhoneOff size={16} className="mr-1" />
                                            <span className="text-sm">Close Chat</span>
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4"
                                >
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user'
                                                ? 'justify-end'
                                                : 'justify-start'
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${message.sender === 'user'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                                                    }`}
                                            >
                                                <p className="break-words">{message.message}</p>
                                                <p
                                                    className={`text-xs mt-1 ${message.sender === 'user'
                                                        ? 'text-blue-100'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
