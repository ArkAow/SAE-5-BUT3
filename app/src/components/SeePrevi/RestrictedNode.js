import React, { useState, useEffect } from "react";
import RestrictedCourseObject from "./RestrictedCourseObject";
import { getShade } from "../../services/colorService";

const RestrictedNode = ({ 
  positionKey, 
  items
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipDirection, setTooltipDirection] = useState("right");


  const visibleItems = items?.slice(0, 3) || [];
  const remainingItemsCount = items?.length > 3 ? items.length - 3 : 0;

  const showTooltip = isHovered && items?.length > 1;

  const adjustTooltipDirection = () => {
    const nodeElement = document.getElementById(positionKey);
    if (nodeElement) {
      const rect = nodeElement.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      setTooltipDirection(rect.left > screenWidth / 2 ? "left" : "right");
    }
  };

  useEffect(() => {
    if (isHovered) {
      adjustTooltipDirection();
    }
  }, [isHovered]);

  return (
    <div
      id={positionKey}
      className="relative min-w-20 h-20 bg-white justify-items-center border border-opacity-75 border-gray-300 p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {items?.length === 1 && (
        <RestrictedCourseObject
          courseType={items[0].courseType}
          color={items[0].color}
          teacher={items[0].teacher}
          duration={items[0].duration}
          />
      )}

      {items?.length > 1 && (
        <div className="relative w-full max-w-20 h-full grid grid-cols-2 grid-rows-2 gap-1 justify-items-center">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-10 h-full max-h-10 rounded-md border-2"
              style={{
                backgroundColor: item.color,
                borderColor: getShade(item.color),
              }}>
            </div>
          ))}
          {remainingItemsCount > 0 && (
            <div className="relative w-full h-full flex items-center justify-center text-black text-xs font-bold">
              +{remainingItemsCount}
            </div>
          )}
        </div>
      )}

      {showTooltip && (
        <div
          className={`absolute top-0 p-2 rounded-xl shadow-lg z-10 w-40 custom-scrollbar-dark ${
            tooltipDirection === "left" ? "left-0 -translate-x-full" : "left-full"
          }`}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "rgba(55, 65, 81, 0.90)",
          }}>
          {items.map((item) => (
            <div key={item.id} className="mb-1 text-white">
              <RestrictedCourseObject
                courseType={item.courseType}
                color={item.color}
                teacher={item.teacher}
                duration={item.duration}
                small
                />
              <strong>--------------</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestrictedNode;
