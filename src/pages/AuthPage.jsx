import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, X, Upload } from "lucide-react";
import { Message } from "../shared/Message";
import { registerDoctor } from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginForm({ setError, login, loginDoctor, isDoctor }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = isDoctor
        ? await loginDoctor(formData.email, formData.password)
        : await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        {isDoctor ? "Doctor Login" : "Welcome Back"}
      </h2>
      <div className="space-y-2">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </motion.button>
    </motion.form>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState("");
  const { login, loginDoctor, register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        {error && (
          <Message type="error" message={error} onClose={() => setError("")} />
        )}
        <div className="flex space-x-8 mb-4 justify-center">
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              isLogin && !isDoctor
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
              setIsDoctor(false);
            }}
          >
            Login
          </button>
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              isLogin && isDoctor
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
              setIsDoctor(true);
            }}
          >
            Doctor Login
          </button>
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              !isLogin && !isDoctor
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
              setIsDoctor(false);
            }}
          >
            Register
          </button>
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              !isLogin && isDoctor
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
              setIsDoctor(true);
            }}
          >
            Register as Doctor
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isLogin ? "login" : "register"}-${
              isDoctor ? "doctor" : "user"
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full"
          >
            {isLogin ? (
              <LoginForm
                setError={setError}
                login={login}
                loginDoctor={loginDoctor}
                isDoctor={isDoctor}
              />
            ) : isDoctor ? (
              <DoctorRegisterForm setError={setError} navigate={navigate} />
            ) : (
              <RegisterForm setError={setError} register={register} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RegisterForm({ setError, register }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Create Account
      </h2>
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your phone number"
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating account..." : "Create Account"}
      </motion.button>
    </motion.form>
  );
}

function DoctorRegisterForm({ setError, navigate }) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    gender: "male",
    phoneNumber: "",
    speciality: "",
    typeConsultation: "all",
    city: "",
    street: "",
    picture: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setLoading(true);
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await registerDoctor(formData);
      if (result.success) {
        navigate("/doctor/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Account" },
    { number: 2, title: "Professional" },
    { number: 3, title: "Location" },
    { number: 4, title: "Photo" },
  ];

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-6 overflow-x-auto pb-2 px-1 -mx-1">
      <div className="flex w-full min-w-max">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                currentStep >= step.number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`ml-1 text-xs md:text-sm ${
                currentStep >= step.number
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-6 md:w-10 h-1 mx-1 md:mx-2 flex-shrink-0 ${
                  currentStep > step.number
                    ? "bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="doctor@example.com"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Speciality
              </label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
                className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a speciality
                </option>
                <option value="Dentist">Dentist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Generalist">Generalist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Consultation Type
              </label>
              <select
                name="typeConsultation"
                value={formData.typeConsultation}
                onChange={handleChange}
                required
                className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Both Online & In-Person</option>
                <option value="video">Video Consultation Only</option>
                <option value="chat">Chat Consultation Only</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full p-2 md:p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="mt-2 flex justify-center px-3 md:px-6 pt-4 pb-5 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-2 text-center">
                  {previewImage ? (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData((prev) => ({ ...prev, picture: null }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Upload className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="picture"
                          className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1"
                        >
                          <span>Upload a file</span>
                          <input
                            id="picture"
                            name="picture"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-1 sm:mt-0 sm:pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Doctor Registration
      </h2>

      {renderStepIndicator()}
      {renderStep()}

      <div className="flex justify-between pt-2">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 text-sm md:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`px-4 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {currentStep === 4
            ? loading
              ? "Creating..."
              : "Create Account"
            : "Next"}
        </motion.button>
      </div>
    </motion.form>
  );
}
