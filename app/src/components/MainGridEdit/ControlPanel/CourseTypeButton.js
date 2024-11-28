import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const CourseTypeButton = () => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const NodePortal = ({ children }) => {
    return createPortal(children, document.getElementById("portal-root"));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <button
        onClick={() => setIsFocused(true)}
        className={`btn-control-panel ${
          isFocused ? "bg-white shadow-lg" : ""
        } transition duration-300`}
      >
        <img
          src="/images/book.svg"
          alt="course type icon"
          className="w-10 h-10"
          draggable="false"
        />
      </button>
      {isFocused && (
        <NodePortal>
          <div className="tooltip" ref={tooltipRef}>
            <h3 className="mb-5 font-bold text-base">
              Modifier les types de cours
            </h3>
          </div>
        </NodePortal>
      )}
    </div>
  );
};
export default CourseTypeButton;
