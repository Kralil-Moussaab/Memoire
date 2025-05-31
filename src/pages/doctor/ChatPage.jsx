import { useState, useEffect, useRef } from 'react';
import { Send, Video, Phone, PhoneOff, User, X, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { goOnline, sendMessage, endChat } from '../../services/api';
import Pusher from 'pusher-js';

export default function ChatPage() {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentChat, setCurrentChat] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const pusherRef = useRef(null);

    useEffect(() => {
        const onlineStatus = localStorage.getItem('isOnline');
        if (onlineStatus === 'true') {
            setIsOnline(true);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if ((!isOnline || !user?.id) && !sessionId) return;

        if (!pusherRef.current) {
            pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            });
        }
        const subscriptions = [];

        if (isOnline && user?.id) {
            const doctorChannelName = `doctor.${user.id}`;
            const doctorChannel = pusherRef.current.subscribe(doctorChannelName);
            subscriptions.push(doctorChannelName);

            doctorChannel.bind('ChatSessionStarted', function (data) {
                setSessionId(data.session.id);
                setCurrentChat({
                    id: data.user.id,
                    name: data.user.name,
                    image: data.user.picture || '/api/placeholder/128/128',
                    lastSeen: 'Just now',
                });

                setMessages(prev => [
                    ...prev.filter(m => !m.text.includes('Waiting for patients')),
                    {
                        id: `system-${Date.now()}-${data.user.id}`,
                        sender: 'system',
                        text: `${data.user.name} has connected for a consultation`,
                        time: formatTime(),
                    }
                ]);
            });
        }

        if (sessionId) {
            const chatChannelName = `chat.${sessionId}`;
            const chatChannel = pusherRef.current.subscribe(chatChannelName);
            subscriptions.push(chatChannelName);

            chatChannel.bind('message', function (data) {
                const messageId = data.id || Date.now();
                setMessages(prev => {
                    if (prev.some(msg => msg.id === messageId)) {
                        return prev;
                    }

                    const newMessage = {
                        id: messageId,
                        sender: data.sender_type === 'App\\Models\\Doctor' ? 'doctor' : 'patient',
                        text: data.message,
                        time: data.created_at ? formatTime(new Date(data.created_at)) : formatTime(),
                    };
                    return [...prev, newMessage];
                });
            });
        }

        return () => {
            subscriptions.forEach(channelName => {
                pusherRef.current.unsubscribe(channelName);
            });

            if (!isOnline && !sessionId) {
                pusherRef.current.disconnect();
                pusherRef.current = null;
            }
        };
    }, [isOnline, user?.id, sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (date = new Date()) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date = new Date()) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleGoOnline = async () => {
        setIsOnline(true);
        localStorage.setItem('isOnline', 'true');
        setMessages([
            {
                id: `system-${Date.now()}`,
                sender: 'system',
                text: 'You are now online and available for consultations. Waiting for patients...',
                time: formatTime(),
            },
        ]);
        const doctorId = user.id;
        const response = await goOnline(doctorId, { soft: true, status: 'online' });
        if (!response.success) {
            console.error('Failed to update user status:', response.error);
        }
    };

    const handleEndChat = async () => {
        if (sessionId) {
            const response = await endChat(sessionId);
            if (response.success) {
                setIsOnline(false);
                localStorage.removeItem('isOnline');
                setMessages([]);
                setCurrentChat(null);
                setSessionId(null);
            } else {
                console.error('Failed to end chat:', response.error);
            }
        } else {
            setIsOnline(false);
            localStorage.removeItem('isOnline');
            setMessages([]);
            setCurrentChat(null);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        const messageToSend = newMessage.trim();
        setNewMessage('');
        try {
            const response = await sendMessage(sessionId, messageToSend);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="max-w-4xl mx-auto p-4">
                {!isOnline ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-10 text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Start Online Consultation
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                Go online to connect with patients and provide virtual medical
                                consultations in real-time
                            </p>
                            <button
                                onClick={handleGoOnline}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all font-medium text-lg cursor-pointer"
                            >
                                Go Online Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-screen flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Chat Header */}
                        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center space-x-3">
                                {currentChat ? (
                                    <>
                                        <div className="relative">
                                            <User className="w-12 h-12 text-green-600 dark:text-green-400 rounded-full object-cover border-2 border-white dark:border-gray-700" />
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {currentChat.name}
                                            </h3>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Online • {currentChat.lastSeen}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-md">
                                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                Dr. {user?.name || 'Jane Doe'}
                                            </h3>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Online • Waiting for patients
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <Phone size={18} />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <Video size={18} />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                                <button
                                    onClick={handleEndChat}
                                    className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                                >
                                    <PhoneOff size={16} className="mr-1" />
                                    <span className="text-sm">End Chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                            <div className="text-center">
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full shadow-sm">
                                    {formatDate()}
                                </span>
                            </div>

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'doctor'
                                        ? 'justify-end'
                                        : message.sender === 'system'
                                            ? 'justify-center'
                                            : 'justify-start'
                                        }`}
                                >
                                    {message.sender === 'system' ? (
                                        <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full text-xs font-medium shadow-sm">
                                            {message.text}
                                        </div>
                                    ) : message.sender === 'doctor' ? (
                                        <div className="max-w-md">
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
                                                <p className="break-words">{message.text}</p>
                                            </div>
                                            <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                                                {message.time}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-w-md flex">
                                            {currentChat && (
                                                <div className="mr-2 self-end mb-6">
                                                    <User className="w-8 h-8 text-green-600 dark:text-green-400 rounded-full object-cover border-2 border-white dark:border-gray-700" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                                    <p className="break-words">{message.text}</p>
                                                </div>
                                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                                    {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm shadow-inner"
                                    disabled={!currentChat}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!currentChat || !newMessage.trim()}
                                    className={`px-4 py-2 ${currentChat && newMessage.trim()
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-blue-300 cursor-not-allowed'
                                        } text-white rounded-lg transition-colors`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}