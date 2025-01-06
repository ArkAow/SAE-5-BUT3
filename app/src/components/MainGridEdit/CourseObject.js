import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { getShade, isBlack } from "../../services/colorService";
import { formatDuration } from "../../services/durationService";

const ITEM_TYPE = "rectangle";

const CourseObject = ({ color, teacher, courseType, duration, positionKey, id, deleteItem, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { positionKey, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const handleCogClick = (event) => {
    event.stopPropagation();
    setShowTooltip(true);
  };

  return (
    <div
      ref={drag}
      className="relative size-16 m-1 rounded-lg border-2 cursor-grab transition-opacity duration-200 flex flex-col justify-between p-1"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
        borderColor: getShade(color),
      }}
    >
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5">
        {courseType}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5">
        {teacher}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2">
        {formatDuration(duration)}
      </div>

      {/* Paramètres */}
      <img
        src={`${isBlack(color) ? "images/cogWheel-white.svg" : "images/cogWheel-black.svg"}`}
        alt="cogWheel"
        className={`absolute -top-3 -right-2 m-1 w-4 h-4 rounded-full cursor-pointer`}
        style={{ backgroundColor: color }}
        onClick={handleCogClick}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute -top-3 -right-8 mt-5 mr-5 p-2 bg-gray-800 bg-opacity-75 text-white rounded shadow-lg z-10 flex flex-col space-y-2">
          <button
            onClick={onEdit}
            className="w-full py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-xs">
            Modifier
          </button>
          <button
            onClick={() => deleteItem(positionKey, id)}
            className="w-full py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700 text-xs">
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseObject;
