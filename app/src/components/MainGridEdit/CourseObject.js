import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { getShade, isBlack } from "../../services/colorService";
import { formatDuration } from "../../services/durationService";

const ITEM_TYPE = "rectangle";
const CourseObject = ({
  color,
  teacher,
  courseType,
  duration,
  positionKey,
  id,
  modifItem,
  deleteItem,
  courseTypes,
  teachers,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { positionKey, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(teacher);
  const [selectedCourseType, setSelectedCourseType] = useState(courseType);
  const [selectedDuration, setSelectedDuration] = useState(duration);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const handleCogClick = (event) => {
    event.stopPropagation();
    setShowTooltip(true);
  };

  const handleEditing = () => {
    setShowModal(true);
    setShowTooltip(false);
  };

  const handleSaveEdit = () => {

    const payload = {
      courseType: selectedCourseType,
      teacher: selectedTeacher,
      duration: selectedDuration,
      positionKey,
      id
    };
    modifItem(payload);
    setShowModal(false);
  };

  return (
    <div
      ref={drag}
      className="relative size-16 m-1 rounded-lg border-2 cursor-grab transition-opacity duration-200 flex flex-col justify-between p-1"
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
        borderColor: getShade(color),
      }}>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5 truncate ">
        {courseType}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5 truncate ">
        {teacher}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2">
        {formatDuration(duration)}
      </div>

      {/* Paramètres */}
      <img
        src={`${
          isBlack(color) ? "images/cogWheel-white.svg" : "images/cogWheel-black.svg"
        }`}
        alt="cogWheel"
        className={`absolute -top-3 -right-2 m-1 w-4 h-4 rounded-full cursor-pointer`}
        style={{ backgroundColor: color }}
        onClick={handleCogClick}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute -top-3 -right-8 mt-5 mr-5 p-2 bg-gray-800 bg-opacity-75 text-white rounded shadow-lg z-10 flex flex-col space-y-2">
          <button
            onClick={handleEditing}
            className="w-full py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-xs">
            Modifier
          </button>
          <button
            onClick={() => deleteItem(positionKey, id)}
            className="w-full py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700 text-xs">
            Supprimer
          </button>
        </div>
      )}

      {/* Editing Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20 text-xs">
          <div className="bg-white p-5 rounded shadow-xl w-1/3 border-2 border-gray-300">
            <h3 className="text-lg font-bold mb-4">Modification du cours</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}>
              <div className="flex items-center gap-2 mb-1 bg-gray-200 p-2 rounded-t-xl">
                <label className="block mb-1 font-bold w-32">Type de cours :</label>
                <select
                  value={selectedCourseType}
                  onChange={(e) => setSelectedCourseType(e.target.value)}
                  className="tooltip-select">
                  <option value="" disabled>
                    Choisir un type de cours
                  </option>
                  {courseTypes?.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  )) || (
                    <option value="" disabled>
                      Aucun type de cours disponible
                    </option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2 mb-1 bg-gray-200 p-2">
                <label className="block mb-1 font-bold w-32">Enseignant :</label>
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="tooltip-select">
                    <option value="" disabled>
                        Choisir un enseignant:
                    </option>
                    {teachers?.map((teacher) => (
                        <option key={teacher.code} value={teacher.code}>
                          {teacher.code}
                        </option>
                    ))}
                </select>                
              </div>

              <div className="flex items-center gap-2 mb-1 bg-gray-200 p-2 rounded-b-xl">
                <label className="block mb-1 font-bold w-52">Durée (en heures):</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step="0.5"
                  value={selectedDuration}
                  onChange={(e) =>setSelectedDuration(Number(e.target.value))}
                  className="tooltip-number-input"/>
              </div>

              <div className="flex justify-center space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-default w-full">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseObject;
