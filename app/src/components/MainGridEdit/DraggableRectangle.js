import React from "react";
import { useDrag } from "react-dnd";

const ITEM_TYPE = "rectangle";

const DraggableRectangle = ({ color, positionKey }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { positionKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="size-16 m-1 rounded border-2 border-black cursor-grab transition-opacity duration-200"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
      }}
    ></div>
  );
};

export default DraggableRectangle;
