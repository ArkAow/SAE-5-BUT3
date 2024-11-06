import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './MainGrid.css';

const GRID_ROW_LENGTH = 4; // Nombre de lignes
const GRID_COL_LENGTH = 8; // Nombre de colonnes
const ITEM_TYPE = 'rectangle';

const MainGrid = () => {
  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FFD700'); // Couleur par défaut

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
      <div className="container">
        <div className="sidebar">
          <h3>Ajouter un rectangle</h3>
          <div>
            <label>Ligne :</label>
            <input
              type="number"
              min="0"
              max={GRID_ROW_LENGTH - 1}
              value={selectedRow}
              onChange={(e) => setSelectedRow(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Colonne :</label>
            <input
              type="number"
              min="0"
              max={GRID_COL_LENGTH - 1}
              value={selectedCol}
              onChange={(e) => setSelectedCol(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Couleur :</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            />
          </div>
          <button className="maingrid-button" onClick={addItem}>Ajouter</button>
        </div>

        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
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
    <div ref={drop} className="node">
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
      className="grid-item"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
      }}
    ></div>
  );
};

export default MainGrid;
