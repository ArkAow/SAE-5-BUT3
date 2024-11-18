import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggableRectangle from "./DraggableRectangle";
import { getShade } from "../../services/colorService";

const ITEM_TYPE = "rectangle";

const Node = ({ positionKey, items, moveItem}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.positionKey !== positionKey) {
        moveItem(draggedItem.positionKey, positionKey);
      }
    },
  });

  const visibleItems = items?.slice(0, 3) || [];
  const remainingItemsCount = items?.length > 3 ? items.length - 3 : 0;

  const showTooltip = isHovered && items?.length > 1 && !isDragging;

  return (
    <div
      ref={drop}
      className="relative min-w-20 h-20 bg-white justify-items-center border border-opacity-75 border-gray-300 p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {items?.length === 1 && (
        <DraggableRectangle
          color={items[0].color}
          positionKey={positionKey}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}/>
      )}

      {items?.length > 1 && (
        <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className="w-full h-full rounded-md border-2"
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
          className="absolute top-0 left-full p-2 rounded-xl shadow-lg z-10 w-40 custom-scrollbar-dark"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "rgba(55, 65, 81, 0.90)",
          }}>
          {items.map((item) => (
            <div key={item.id} className="mb-1 text-white">
              <DraggableRectangle
                color={item.color}
                positionKey={positionKey}
                id={item.id}
                small
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}/>
              <strong>ID:</strong> {item.id} <br />
              <strong>Color:</strong> {item.color}
              <br />
              <strong>--------------</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Node;
