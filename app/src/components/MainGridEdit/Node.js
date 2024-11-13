import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggableRectangle from "./DraggableRectangle";

const ITEM_TYPE = "rectangle";

const Node = ({ positionKey, items, moveItem }) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.positionKey !== positionKey) {
        moveItem(draggedItem.positionKey, positionKey);
      }
    },
  });

  const [isHovered, setIsHovered] = useState(false);

  const visibleItems = items.slice(0, 3);
  const remainingItemsCount = items.length > 3 ? items.length - 3 : 0;

  return (
    <div
      ref={drop}
      className="w-20 h-20 bg-white border border-opacity-75 border-gray-300 relative p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.length === 1 && (
        <DraggableRectangle
          color={items[0].color}
          positionKey={positionKey}
        />
      )}

      {items.length > 1 && (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 relative">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className="w-full h-full rounded-md border border-black"
              style={{
                backgroundColor: item.color,
              }}
            ></div>
          ))}

          {remainingItemsCount > 0 && (
            <div className="w-full h-full flex items-center justify-center text-black text-xs font-bold">
              +{remainingItemsCount}
            </div>
          )}
        </div>
      )}

      {isHovered && items.length > 0 && (
        <div className="absolute top-0 left-full ml-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg z-10 w-32">
          {items.map((item) => (
            <div key={item.id} className="mb-1">
              <strong>ID:</strong> {item.id} <br />
              <strong>Color:</strong> {item.color}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Node;
