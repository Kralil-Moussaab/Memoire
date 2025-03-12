import React, { useEffect } from "react";

export const Message = ({ type, message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const messageLines = message.split("\n");

  return (
    <div className="fixed top-24 right-4 z-50 max-w-md animate-fade-in">
      <div
        className={`${
          type === "success"
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500"
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-500"
        } rounded-lg shadow-lg p-4 border-l-4`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            {type === "success" ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {type === "success" ? "Success" : "Error"}
            </p>
            <div className="mt-1 text-sm">
              {messageLines.map((line, index) => (
                <p key={index} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`${
                type === "success"
                  ? "hover:bg-green-200 dark:hover:bg-green-800"
                  : "hover:bg-red-200 dark:hover:bg-red-800"
              } inline-flex rounded-md cursor-pointer p-1.5  transition-colors`}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
