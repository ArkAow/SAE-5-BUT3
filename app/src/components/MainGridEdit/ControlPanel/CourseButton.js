import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";  // Importer createPortal pour rendre l'élément dans un conteneur global

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

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsFocused((prev) => !prev)}
                className={`btn-control-panel ${isFocused ? "bg-white shadow-lg" : ""} transition duration-300`}>
                <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" />
            </button>

            {/* Tooltip rendu dans le portail global */}
            {isFocused && (
                <NodePortal>
                    <div
                        ref={tooltipRef}
                        className="absolute z-50 top-32 left-32 w-52 p-3 bg-white shadow-lg rounded-lg">
                        <h3 className="mb-5">Ajouter un rectangle</h3>
                        <div className="flex flex-row mb-5">
                            <label className="mr-2 text-clip text-nowrap">Ligne :</label>
                            <input
                                type="number"
                                min="0"
                                max="3"
                                value={selectedRow}
                                onChange={(e) => setSelectedRow(Number(e.target.value))}
                                className="w-full bg-gray-300 rounded-full pl-6"/>
                        </div>

                        <div className="flex flex-row mb-5">
                            <label className="mr-2 text-clip text-nowrap">Colonne :</label>
                            <input
                                type="number"
                                min="0"
                                max="7"
                                value={selectedCol}
                                onChange={(e) => setSelectedCol(Number(e.target.value))}
                                className="w-full bg-gray-300 rounded-full pl-6"/>
                        </div>

                        <div className="flex flex-row mb-5">
                            <label className="mr-2 text-clip text-nowrap">Couleur :</label>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full"/>
                        </div>

                        <button
                            onClick={addItem}
                            className="px-3 py-2 w-full bg-primary text-white rounded cursor-pointer hover:bg-primaryshade active:bg-primarytint transition-colors duration-300">
                            Ajouter
                        </button>
                    </div>
                </NodePortal>
            )}
        </div>
    );
};

export default CourseButton;
