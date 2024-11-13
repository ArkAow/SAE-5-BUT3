import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel";

const GRID_ROW_LENGTH = 16;
const GRID_COL_LENGTH = 10;

const MainGrid = () => {
  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFD700");

  const addItem = () => {
    const positionKey = `${selectedRow}-${selectedCol}`;
    const newItem = { color: selectedColor, id: Date.now() };
    setItems((prevItems) => ({
      ...prevItems,
      [positionKey]: [...(prevItems[positionKey] || []), newItem],
    }));
  };

  const moveItem = (fromKey, toKey) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      if (fromItems.length === 0) return prevItems;
      const draggedItem = fromItems.pop();
      return {
        ...prevItems,
        [fromKey]: fromItems,
        [toKey]: [...toItems, draggedItem],
      };
    });
  };

  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROW_LENGTH; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COL_LENGTH; col++) {
        currentRow.push({ row, col });
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const grid = createGrid();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex justify-center items-start bg-cover bg-center bg-landscape py-10">
        <ControlPanel
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          selectedCol={selectedCol}
          setSelectedCol={setSelectedCol}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          addItem={addItem}/>
        
        <div className="flex flex-col items-center mt-10 rounded-lg overflow-auto max-h-[25rem] max-w-[60rem]">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((node, nodeIndex) => {
                const positionKey = `${node.row}-${node.col}`;
                const cellItems = items[positionKey] || [];
                return (
                  <Node
                    key={nodeIndex}
                    positionKey={positionKey}
                    items={cellItems}
                    moveItem={moveItem}/>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MainGrid;
