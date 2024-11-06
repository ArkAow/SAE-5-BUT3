import React from 'react';
import './MainGrid.css';

const GRID_ROW_LENGTH = 4; // Nombre de lignes
const GRID_COL_LENGTH = 8; // Nombre de colonnes

const MainGrid = () => {
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
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((node, nodeIndex) => (
            <div key={nodeIndex} className="node">
              {/* Ici on peut ajouter le contenu ou style selon la position */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MainGrid;
