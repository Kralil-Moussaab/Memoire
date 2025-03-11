import React, { useEffect } from "react";

export const Message = ({ type, message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur z-50">
      <div
        className={`${
          type === "success"
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        } rounded-xl shadow-lg p-6 max-w-md w-full mx-4`}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {type === "success" ? "Success!" : "Error"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};
