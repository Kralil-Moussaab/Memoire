import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  UserCircle,
  Heart,
  Droplet,
} from "lucide-react";
import { Message } from "../shared/Message";

export default function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    sexe: "",
    chronicDisease: "",
    groupage: "",
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        age: user.age || "",
        sexe: user.sexe || "",
        chronicDisease: user.chronicDisease || "",
        groupage: user.groupage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      const result = await updateProfile({
        ...formData,
        password: confirmPassword,
      });
      if (result.success) {
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setShowConfirmModal(false);
        setConfirmPassword("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.password !== passwordData.password_confirmation) {
      setError("New passwords do not match");
      return;
    }

    try {
      const result = await changePassword(passwordData);

      if (result.success) {
        setSuccess("Password updated successfully!");
        setPasswordData({
          old_password: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to update password. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <p className="text-gray-600 dark:text-gray-400">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                <User size={48} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-blue-100 text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <nav className="flex justify-center sm:justify-start">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-8 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-8 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "security"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <Message
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            {success && (
              <Message
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            )}

            {activeTab === "profile" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Profile Details
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <div className="relative group">
                          <User
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="relative group">
                          <Mail
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative group">
                          <Phone
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Age
                        </label>
                        <div className="relative group">
                          <Calendar
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div> */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender
                        </label>
                        <div className="relative group">
                          <UserCircle
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <select
                            name="sexe"
                            value={formData.sexe}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chronic Disease
                        </label>
                        <div className="relative group">
                          <Heart
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <input
                            type="text"
                            name="chronicDisease"
                            value={formData.chronicDisease}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Blood Type
                        </label>
                        <div className="relative group">
                          <Droplet
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                          <select
                            name="groupage"
                            value={formData.groupage}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Name
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <Mail className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <Phone className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Phone Number
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.phoneNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Age
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.age || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <UserCircle className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Gender
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.sexe || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <Heart className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chronic Disease
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.chronicDisease || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                          <Droplet className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Blood Type
                          </p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.groupage || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                  Change Password
                </h2>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative group">
                      <Lock
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="old_password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <Lock
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="password_confirmation"
                        value={passwordData.password_confirmation}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={logout}
                className="w-full sm:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Your Password
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please enter your password to confirm these changes.
            </p>
            <div className="mb-6">
              <div className="relative group">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmPassword("");
                }}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
