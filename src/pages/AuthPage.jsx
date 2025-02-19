import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex space-x-8 mb-4">
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
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[26rem]"
        >
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoginForm() {
  return (
    <motion.form
      className="space-y-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold">Login to Your Account</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" /> <span>Remember me</span>
        </div>
        <a href="#" className="text-blue-500 text-sm">
          Forgot password?
        </a>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-full bg-blue-500 text-white py-2 rounded hover:cursor-pointer"
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
      transition={{ duration: 0.5 }}
    >
      <span className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Join Med-Link</h2>
        <p className="text-sm text-gray-500">
          Are you a doctor?{" "}
          <a href="#" className="text-blue-500">
            Register Here
          </a>
        </p>
      </span>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Create Password"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Numéro de téléphone"
        className="w-full p-2 border rounded"
      />
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" />{" "}
        <span>By signing up, I agree to terms</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-full bg-blue-500 text-white py-2 rounded hover:cursor-pointer"
      >
        Register
      </motion.button>
    </motion.form>
  );
}
