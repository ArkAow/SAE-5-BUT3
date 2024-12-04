import React from "react";

const Toast = ({ message, type, onClose }) => {
  const toastStyle = type === "success" ? "bg-accept" : "bg-primaryshade";

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2">
      <div
        className={`animate-wiggle px-4 py-2 text-white rounded shadow ${toastStyle}`}>
        {message}
        <button onClick={onClose} className="ml-4 text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;