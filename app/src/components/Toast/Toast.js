import React, { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
  const [progress, setProgress] = useState(100);
  const toastStyle = type === "success" ? "bg-accept" : "bg-primaryshade";

  useEffect(() => {
    const duration = 5000;
    const interval = 30;
    const decrement = (interval / duration) * 100;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    const sliderInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(sliderInterval);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => {
      clearTimeout(timer);
      clearInterval(sliderInterval);
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-80">
      <div
        className={`animate-wiggle px-4 py-2 text-white text-center rounded shadow ${toastStyle}`}>
        {message}
        <div className={`w-full h-1 ${  type === "success" ? `bg-green-700` : `bg-primary` } mt-1 rounded overflow-hidden`}>
          <div
            className={`h-full ${  type === "success" ? `bg-green-300` : `bg-primarytint` }`}
            style={{ width: `${progress}%`, transition: "width 30ms linear" }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;