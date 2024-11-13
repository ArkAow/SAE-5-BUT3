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

  const visibleItem = items[0];
  const hiddenItemsCount = items.length - 1;

  return (
    <div
      ref={drop}
      className="w-20 h-20 bg-white border border-opacity-75 border-gray-300 flex justify-center items-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {visibleItem && (
        <DraggableRectangle
          key={visibleItem.id}
          color={visibleItem.color}
          positionKey={positionKey}
        />
      )}

      {hiddenItemsCount > 0 && (
        <div className="absolute bottom-0 right-0 text-xs text-gray-600 bg-white rounded-full px-1">
          +{hiddenItemsCount}
        </div>
      )}

      {isHovered && items.length > 0 && (
        <div className="absolute top-0 left-full ml-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg z-10 w-32 opacity-75">
          {items.map((item) => (
            <div key={item.id} className="mb-1">
              <strong>ID:</strong> {item.id} <br />
              <strong>Color:</strong> {item.color}<br />
              <strong>----------</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Node;
