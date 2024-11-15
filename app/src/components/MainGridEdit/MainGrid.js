import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";

const GRID_ROW_LENGTH = 25;
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-landscape py-10">
      <div className="flex items-center justify-start gap-5 h-20 px-10">
        <div className="absolute top-6">
          <ControlPanel
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            selectedCol={selectedCol}
            setSelectedCol={setSelectedCol}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            addItem={addItem}/>
        </div>

        <button className="flex min-w-fit h-10 ml-24 mt-2 items-center px-4 py-2 text-white bg-primary rounded-full shadow-md hover:bg-primaryshade focus:bg-primarytint focus:outline-none">
          Passer au suivant
          <img
            src="/images/right-arrow.svg"
            alt="Right Arrow"
            className="ml-2 w-4 h-4"/>
        </button>

        <select className="w-fit h-10 mt-2 px-4 py-2 text-white bg-primary border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primarytint focus:outline-none">
          <option value="" disabled selected>
            Sélectionnez une ressource
          </option>
          <option value="R1.01">R1.01 - Ressource 1</option>
          <option value="R2.01">R2.01 - Ressource 2</option>
          <option value="R3.01">R3.01 - Ressource 3</option>
        </select>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="ml-36 rounded-lg overflow-auto max-h-[75vh] min-h-[25rem] max-w-[85vw]">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `60px repeat(${GRID_COL_LENGTH}, minmax(5rem, 1fr))`,
            }}>

            <div className="w-20 h-6"></div>
            {Array.from({ length: GRID_COL_LENGTH }).map((_, colIndex) => (
              <div
                key={`col-label-${colIndex}`}
                className="w-full h-6 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                G{colIndex + 1}
              </div>
            ))}

            {Array.from({ length: GRID_ROW_LENGTH }).map((_, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                <div className="h-20 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                  S{rowIndex + 1}
                </div>
                {Array.from({ length: GRID_COL_LENGTH }).map((_, colIndex) => {
                  const positionKey = `${rowIndex}-${colIndex}`;
                  const cellItems = items[positionKey] || [];
                  return (
                    <Node
                      key={positionKey}
                      positionKey={positionKey}
                      items={cellItems}
                      moveItem={moveItem}/>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default MainGrid;
