import React, { useState } from "react";

export const CourseButton = ({ onClick, setSelectedColor }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="btn-control-panel">

        <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" />
      </button>
      {showTooltip && (
        <div className="absolute z-10 top-0 left-16 w-40 p-3 bg-white shadow-lg rounded-lg">
          <h3 className="mb-2 text-center font-bold">Ajouter un rectangle</h3>
          <div className="flex flex-col">

            <label className="text-sm">Ligne :</label>
            <input
              type="number"
              min="0"
              max="3"
              className="mb-2 border rounded p-1 text-sm"/>

            <label className="text-sm">Colonne :</label>
            <input
              type="number"
              min="0"
              max="7"
              className="mb-2 border rounded p-1 text-sm"/>

            <label className="text-sm">Couleur :</label>
            <input type="color" className="mb-2" onChange={handleColorChange} />

            <button
              onClick={onClick}
              className="px-2 py-1 w-full bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 text-sm">
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseButton;