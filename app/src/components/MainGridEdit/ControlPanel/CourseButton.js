import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const CourseButton = ({
    selectedRow,
    setSelectedRow,
    selectedCol,
    setSelectedCol,
    selectedColor,
    setSelectedColor,
    addItem,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [selectedCourseType, setSelectedCourseType] = useState("");

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

    const NodePortal = ({ children }) => {
        return createPortal(
            children,
            document.getElementById("portal-root")
        );
    };

    const courseTypes = [
        { name: "CM", color: "#FFD700" },
        { name: "TD", color: "#FF3131" },
        { name: "TP", color: "#38B6FF" },
    ];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsFocused((prev) => !prev)}
                className={`btn-control-panel ${isFocused ? "bg-white shadow-lg" : ""} transition duration-300`}>
                <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" draggable="false" />
            </button>

            {/* Tooltip rendu dans le portail global */}
            {isFocused && (
                <NodePortal>
                    <div
                        className="absolute top-32 left-32 bg-white p-5 rounded-lg shadow-lg w-80 text-xs"
                        ref={tooltipRef}>
                        <h3 className="mb-5">Ajouter un rectangle</h3>
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
                            <label className="block mb-1">Type de cours :</label>
                            <select
                                value={selectedCourseType}
                                onChange={(e) => setSelectedCourseType(e.target.value)}
                                className="w-full p-2 border rounded">
                                <option value="" disabled>
                                Choisir un type
                                </option>
                                {courseTypes.map((type) => (
                                <option key={type.name} value={type.name}>
                                    {type.name}
                                </option>
                                ))}
                            </select>
                        </div>


                        <button
                            onClick={addItem}
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
