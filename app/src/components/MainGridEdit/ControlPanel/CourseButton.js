import React, { useState } from "react";

export const CourseButton = ({
    selectedRow,
    setSelectedRow,
    selectedCol,
    setSelectedCol,
    selectedColor,
    setSelectedColor,
    addItem,
  }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="btn-control-panel">
        <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" /> 
      </button>

      {showTooltip && (
        <div className="absolute z-[5px] top-0 left-16 w-52 p-3 bg-white shadow-lg rounded-lg">
            <h3 className="mb-5">Ajouter un rectangle</h3>
            <div className="flex flex-row">
            <label className="mr-2 text-clip text-nowrap">Ligne :</label>
            <input
                type="number"
                min="0"
                max="3"
                value={selectedRow}
                onChange={(e) => setSelectedRow(Number(e.target.value))}
                className="mb-5 w-full bg-gray-300 rounded-full pl-6"/>
            </div>
            <div className="flex flex-row">
            <label className="mr-2 text-clip text-nowrap">Colonne :</label>
            <input
                type="number"
                min="0"
                max="7"
                value={selectedCol}
                onChange={(e) => setSelectedCol(Number(e.target.value))}
                className="mb-5 w-full bg-gray-300 rounded-full pl-6"/>
            </div>
            <div className="flex flex-row">
            <label className="mr-2 text-clip text-nowrap">Couleur :</label>
            <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="mb-5 w-full"/>
            </div>
            <button
            onClick={addItem}
            className="px-3 py-2 w-full bg-green-500 transition-colors duration-300 text-white rounded cursor-pointer hover:bg-green-600">
            Ajouter
            </button>
        </div>
      )}
    </div>
  );
};

export default CourseButton;