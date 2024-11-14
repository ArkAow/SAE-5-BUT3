import React, { useState, useRef, useEffect } from "react";

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

    // Gestion du clic en dehors pour fermer le focus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsFocused((prev) => !prev)}
                className={`btn-control-panel ${isFocused ? "bg-white shadow-lg" : ""} transition duration-300`}
            >
                <img src="/images/book.svg" alt="book icon" className="w-10 h-10 fill-primary" />
            </button>

            {isFocused && (
                <div className="absolute z-20 top-0 right-16 w-52 p-3 bg-white shadow-lg rounded-lg">
                    <h3 className="mb-5">Ajouter un rectangle</h3>
                    <div className="flex flex-row mb-5">
                        <label className="mr-2 text-clip text-nowrap">Ligne :</label>
                        <input
                            type="number"
                            min="0"
                            max="3"
                            value={selectedRow}
                            onChange={(e) => setSelectedRow(Number(e.target.value))}
                            className="w-full bg-gray-300 rounded-full pl-6"
                        />
                    </div>
                    <div className="flex flex-row mb-5">
                        <label className="mr-2 text-clip text-nowrap">Colonne :</label>
                        <input
                            type="number"
                            min="0"
                            max="7"
                            value={selectedCol}
                            onChange={(e) => setSelectedCol(Number(e.target.value))}
                            className="w-full bg-gray-300 rounded-full pl-6"
                        />
                    </div>
                    <div className="flex flex-row mb-5">
                        <label className="mr-2 text-clip text-nowrap">Couleur :</label>
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <button
                        onClick={addItem}
                        className="px-3 py-2 w-full bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-colors duration-300"
                    >
                        Ajouter
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseButton;
