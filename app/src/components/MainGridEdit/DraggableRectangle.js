import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { getShade, isBlack } from "../../services/colorService";

const ITEM_TYPE = "rectangle";

const DraggableRectangle = ({ color, positionKey, professor, courseType, duration, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { positionKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleCogClick = (event) => {
    event.stopPropagation(); // Prevent click events from propagating to parent elements
    setShowTooltip(!showTooltip); // Toggle the tooltip
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
        CM
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5">
        AP
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2">
        2h
      </div>


      <img
        src={`${isBlack(color) ? "images/cogWheel-white.svg" : "images/cogWheel-black.svg"}`}
        alt="cogWheel"
        className={`absolute -top-3 -right-2 m-1 w-4 h-4 rounded-full cursor-pointer`}
        style={{ backgroundColor: color }}
        onClick={handleCogClick}
      />

      {showTooltip && (
        <div
          className="absolute top-0 right-0 mt-5 mr-5 p-2 bg-gray-800 text-white rounded shadow-lg z-10 flex flex-col space-y-2"
          style={{
            width: "120px",
            backgroundColor: "rgba(55, 65, 81, 0.90)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            className="w-full py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-xs"
          >
            Modifier
          </button>
          <button
            onClick={onDelete}
            className="w-full py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700 text-xs"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableRectangle;
