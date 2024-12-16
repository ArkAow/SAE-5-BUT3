import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import routes from "../../../Routes/routes";

export const CourseButton = ({
    isNoGroups,
    selectedRow,
    setSelectedRow,
    selectedCol,
    setSelectedCol,
    courseTypes,
    selectedCourseType,
    setSelectedCourseType,
    selectedTeacher,
    setSelectedTeacher,
    selectedDuration,
    setSelectedDuration,
    addItem,
}) => {  
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState("");
    const [teachers, setTeachers] = useState([]);
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchTeachers = async () => {
        try {
          const response = await fetch(routes.dev.teachers.get());
          if (!response.ok) throw new Error("Erreur lors du chargement des enseignants");
          const data = await response.json();
          setTeachers(data);
        } catch (error) {
          console.error(error);
        }
      };

    const NodePortal = ({ children }) => {
        return createPortal(
            children,
            document.getElementById("portal-root")
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeacher) {
          setError("Veuillez sélectionner un professeur.");
          return;
        }
        setError("");
        addItem();
    };

    useEffect(() => {
        fetchTeachers();
      }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsFocused((prev) => !prev)}
                className={`btn-control-panel ${isFocused ? "bg-white shadow-lg" : ""} transition duration-300`}
                disabled={isNoGroups}>
                <img src="/images/add-block.svg" alt="book icon" className="w-10 h-10 fill-primary" draggable="false" />
            </button>

            {/* Tooltip rendu dans le portail global */}
            {isFocused && (
                <NodePortal>
                    <div
                        className="tooltip"
                        ref={tooltipRef}>
                        <h3 className="mb-5 font-bold text-base">Ajouter un cours</h3>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row mb-5">
                                <label className="mr-2 text-clip text-nowrap">Ligne :</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="3"
                                    value={selectedRow}
                                    onChange={(e) => setSelectedRow(Number(e.target.value))}
                                    className="w-14 bg-gray-300 rounded-full pl-6"/>
                            </div>
                            <div className="flex flex-row mb-5">
                                <label className="mr-2 text-clip text-nowrap">Colonne :</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={selectedCol}
                                    onChange={(e) => setSelectedCol(Number(e.target.value))}
                                    className="w-14 bg-gray-300 rounded-full pl-6"/>
                            </div>                            
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-bold">Type de cours :</label>
                            <select
                                value={selectedCourseType.name}
                                onChange={(e) => {
                                    const selectedType = courseTypes.find((type) => type.name === e.target.value);
                                    setSelectedCourseType(selectedType);
                                }}
                                className="w-full p-2 border rounded">
                                <option value="" disabled>
                                Choisir un type de cours
                                </option>
                                {courseTypes.map((type) => (
                                    <option key={type.name} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-bold">Professeur :</label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="w-full p-2 border rounded">
                                <option value="" disabled>
                                Choisir un professeur
                                </option>
                                {teachers.map((teacher) => (
                                <option key={teacher.name} value={teacher.name}>
                                    {teacher.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-bold">Durée (en heure):</label>
                            <input
                                type="number"
                                step="0.5"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                                className="w-full bg-gray-300 rounded-full pl-6"/>
                        </div>
                        {error && <p className="text-red-700 text-sm text-center w-full">{error}</p>}
                        <button
                            onClick={handleSubmit}
                            className="px-3 py-2 w-full btn-default">
                            Ajouter
                        </button>
                    </div>
                </NodePortal>
            )}
        </div>
    );
};

export default CourseButton;
