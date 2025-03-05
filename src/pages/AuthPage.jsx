import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex space-x-8 mb-4 justify-center">
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              isLogin
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-black dark:text-white"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`text-lg hover:cursor-pointer font-semibold ${
              !isLogin
                ? "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
                : "text-black dark:text-white"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full"
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <motion.form
      className="space-y-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Login to Your Account
      </h2>
      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-gray-700 dark:text-gray-300"
          >
            Remember me
          </label>
        </div>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
        >
          Forgot password?
        </a>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Login
      </motion.button>
    </motion.form>
  );
}

function RegisterForm() {
  return (
    <motion.form
      className="space-y-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Join Med-Link
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Are you a doctor?{" "}
          <a
            href="#"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            Register Here
          </a>
        </p>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Create Password"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <label
          htmlFor="terms"
          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
        >
          By signing up, I agree to terms
        </label>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Register
      </motion.button>
    </motion.form>
  );
}