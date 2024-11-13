import React from "react";

const ControlPanel = ({
  selectedRow,
  setSelectedRow,
  selectedCol,
  setSelectedCol,
  selectedColor,
  setSelectedColor,
  addItem,
}) => (
  <div className="mr-5 p-5 bg-gray-200 rounded-lg shadow-md mt-10 h-[25rem]">
    <h3 className="mb-5">Ajouter un rectangle</h3>
    <div className="flex flex-row">
      <label className="mr-2 text-clip text-nowrap">Ligne :</label>
      <input
        type="number"
        min="0"
        max="3"
        value={selectedRow}
        onChange={(e) => setSelectedRow(Number(e.target.value))}
        className="mb-5 w-full"/>
    </div>
    <div className="flex flex-row">
      <label className="mr-2 text-clip text-nowrap">Colonne :</label>
      <input
        type="number"
        min="0"
        max="7"
        value={selectedCol}
        onChange={(e) => setSelectedCol(Number(e.target.value))}
        className="mb-5 w-full"/>
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
);

export default ControlPanel;
