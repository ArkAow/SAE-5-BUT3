import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const GRID_ROW_LENGTH = 4;
const GRID_COL_LENGTH = 8;
const ITEM_TYPE = 'rectangle';

const MainGrid = () => {
  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FFD700');

  const addItem = () => {
    const positionKey = `${selectedRow}-${selectedCol}`;
    const newItem = { color: selectedColor, id: positionKey };
    setItems((prevItems) => ({
      ...prevItems,
      [positionKey]: newItem,
    }));
  };

  const moveItem = (fromKey, toKey) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems };
      newItems[toKey] = newItems[fromKey];
      delete newItems[fromKey];
      return newItems;
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
        <div className="mr-5 p-5 bg-gray-200 rounded-lg shadow-md">
          <h3 className="mb-5">Ajouter un rectangle</h3>
          <div className='flex flex-row'>
            <label className="mr-2 text-clip text-nowrap">Ligne :</label>
            <input
              type="number"
              min="0"
              max={GRID_ROW_LENGTH - 1}
              value={selectedRow}
              onChange={(e) => setSelectedRow(Number(e.target.value))}
              className="mb-5 w-full"
            />
          </div>
          <div className='flex flex-row'>
            <label className="mr-2 text-clip text-nowrap">Colonne :</label>
            <input
              type="number"
              min="0"
              max={GRID_COL_LENGTH - 1}
              value={selectedCol}
              onChange={(e) => setSelectedCol(Number(e.target.value))}
              className="mb-5 w-full"
            />
          </div>
          <div className='flex flex-row'>
            <label className="mr-2 text-clip text-nowrap">Couleur :</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="mb-5 w-full"
            />
          </div>
          <button
            onClick={addItem}
            className="px-3 py-2 w-full bg-green-500 transition-colors duration-300 text-white rounded cursor-pointer hover:bg-green-600"
          >
            Ajouter
          </button>
        </div>

        <div className="flex flex-col items-center">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((node, nodeIndex) => {
                const positionKey = `${node.row}-${node.col}`;
                const item = items[positionKey];

                return (
                  <Node
                    key={nodeIndex}
                    positionKey={positionKey}
                    item={item}
                    moveItem={moveItem}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

// Composant Node pour chaque cellule de la grille
const Node = ({ positionKey, item, moveItem }) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.positionKey !== positionKey) {
        moveItem(draggedItem.positionKey, positionKey);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="w-20 h-20 bg-white border border-opacity-75 border-gray-300 flex justify-center items-center relative"
    >
      {item && <DraggableRectangle color={item.color} positionKey={positionKey} />}
    </div>
  );
};

// Composant DraggableRectangle pour chaque carré coloré
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
      className="w-16 h-16 rounded border-2 border-black cursor-grab transition-opacity duration-200"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
      }}
    ></div>
  );
};

export default MainGrid;
