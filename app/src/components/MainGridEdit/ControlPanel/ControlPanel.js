import React, { useState } from "react";

const ControlPanel = ({
  selectedRow,
  setSelectedRow,
  selectedCol,
  setSelectedCol,
  selectedColor,
  setSelectedColor,
  addItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`mr-5 mt-10 p-5 bg-primary rounded-3xl shadow-md transition-all duration-300 ${
        isExpanded ? "h-[25rem] w-20" : "h-20 w-20"
      } flex flex-col items-center justify-between`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-transform duration-200 ${
          isExpanded
            ? "w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
            : "w-10 h-10 bg-white rounded-lg flex items-center justify-center"}`}>
        <img
          src={isExpanded ? "/images/minus.svg" : "/images/plus.svg"}
          alt={isExpanded ? "collapse icon" : "expand icon"}
          className={`w-7 h-7 ${isExpanded ? "fill-primary" : "fill-primary"}`}/>
      </button>

      {isExpanded && (
        <div className="flex flex-row items-center space-y-3">
          <div className="grid grid-rows-3 gap-2">

            <div className="relative">
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="btn-control-panel">
                <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" />
              </button>
              {showTooltip && (
                <div className="absolute top-12 left-0 w-40 p-3 bg-white shadow-lg rounded-lg">
                  <h3 className="mb-2 text-center font-bold">Ajouter un rectangle</h3>
                  <div className="flex flex-col">
                    <label className="text-sm">Ligne :</label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={selectedRow}
                      onChange={(e) => setSelectedRow(Number(e.target.value))}
                      className="mb-2 border rounded p-1 text-sm"
                    />
                    <label className="text-sm">Colonne :</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={selectedCol}
                      onChange={(e) => setSelectedCol(Number(e.target.value))}
                      className="mb-2 border rounded p-1 text-sm"
                    />
                    <label className="text-sm">Couleur :</label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="mb-2"
                    />
                    <button
                      onClick={addItem}
                      className="px-2 py-1 w-full bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="btn-control-panel">
              <img src="/images/group.svg" alt="group icon" className="w-10 h-10" />
            </button>


            <button className="btn-control-panel">
              <img src="/images/dialogue.svg" alt="dialogue icon" className="w-10 h-10" />
            </button>

            <button className="btn-control-panel">
              <img src="/images/printer.svg" alt="printer icon" className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
