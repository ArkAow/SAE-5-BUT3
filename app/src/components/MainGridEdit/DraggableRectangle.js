import React from "react";
import { useDrag } from "react-dnd";
import { getShade, isBlack } from "../../services/colorService";

const ITEM_TYPE = "rectangle";

const DraggableRectangle = ({ color, positionKey }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { positionKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const handleClick = () => {
    alert("I'm gonna brown ! ");
    
  };

  return (
    <div
      ref={drag}
      className="relative size-16 m-1 rounded-lg border-2 cursor-grab transition-opacity duration-200"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
        borderColor: getShade(color),
      }}
    >
    <img
    src={`${isBlack(color) ? "images/cogWheel-white.svg" : "images/cogWheel-black.svg"}`}
    alt="cogWheel"
    className={`absolute -top-3 -right-2 m-1 w-4 h-4 rounded-full`}
    style={{ backgroundColor: color }}
    onClick={handleClick}
    />

      
    </div>
  );
};

export default DraggableRectangle;
