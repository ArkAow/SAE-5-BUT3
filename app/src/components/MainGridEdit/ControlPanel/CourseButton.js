import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import routes from "../../../Routes/routes";

export const CourseButton = ({
    isNoGroups,
    groupList,
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
    const [isRepeat, setIsRepeat] = useState(false);
    const [repeatFrom, setRepeatFrom] = useState(0);
    const [repeatTo, setRepeatTo] = useState(7);
    const [exceptions, setExceptions] = useState("");
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
        return createPortal(children, document.getElementById("portal-root"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeacher) {
            setError("Veuillez sélectionner un professeur.");
            return;
        }
        setError("");
        const payload = {
            teacher: selectedTeacher,
            courseType: selectedCourseType,
            duration: selectedDuration,
            group: groupList[selectedCol],
        };
        if (isRepeat) {
            payload.isRepeat = isRepeat;
            payload.repeatFrom = repeatFrom;
            payload.repeatTo = repeatTo;
            payload.exceptions = exceptions.split(";").map((val) => val.trim()).filter(Boolean);
        } else {
            payload.week = selectedRow;
        }
        console.log("Données du cours :", payload);
        addItem(payload);
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
                    <div className="tooltip" ref={tooltipRef}>
                        <h3 className="mb-5 font-bold text-base">Ajouter un cours</h3>

                        <div className="mb-1 bg-gray-200 p-2 rounded-t-xl">
                            <label className="block mb-1 font-bold">
                                <input
                                    type="checkbox"
                                    checked={isRepeat}
                                    onChange={(e) => setIsRepeat(e.target.checked)}
                                    className="mr-2"
                                />
                                Répéter
                            </label>
                        </div>

                        {isRepeat ? (
                            <div>
                                <div className="flex items-center gap-4 mb-1 bg-gray-200 p-2">
                                    <div className="flex items-center gap-2">
                                        <label className="block mb-1 font-bold">De</label>
                                        <select
                                        value={repeatFrom}
                                        onChange={(e) => setRepeatFrom(Number(e.target.value))}
                                        className="tooltip-select">
                                        {Array.from({ length: 8 }, (_, i) => (
                                            <option key={i} value={i}>
                                            Semaine {i}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="block mb-1 font-bold">À</label>
                                        <select
                                        value={repeatTo}
                                        onChange={(e) => setRepeatTo(Number(e.target.value))}
                                        className="tooltip-select">
                                        {Array.from({ length: 8 }, (_, i) => (
                                            <option key={i} value={i}>
                                            Semaine {i}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3 bg-gray-200 p-2 rounded-b-xl">
                                    <label className="block mb-1 font-bold">Exceptions (séparées par ";") :</label>
                                    <input
                                        type="text"
                                        value={exceptions}
                                        onChange={(e) => setExceptions(e.target.value)}
                                        placeholder="Ex: 2; 4; 6"
                                        className="w-full text-primary bg-white rounded-full ring-1 ring-primary pl-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-3 bg-gray-200 p-2 rounded-b-xl">
                                <label className="w-20 block mb-1 font-bold">Semaine :</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={selectedRow}
                                    onChange={(e) => setSelectedRow(Number(e.target.value))}
                                    className="w-full text-primary bg-white rounded-full ring-1 ring-primary pl-2"
                                />
                            </div>
                        )}

                        <div className="mb-1 bg-gray-200 p-2 rounded-t-xl">
                            <label className="block mb-1 font-bold">Type de cours :</label>
                            <select
                                value={selectedCourseType.name}
                                onChange={(e) => {
                                    const selectedType = courseTypes.find((type) => type.name === e.target.value);
                                    setSelectedCourseType(selectedType);
                                }}
                                className="tooltip-select">
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

                        <div className="mb-1 bg-gray-200 p-2">
                            <label className="block mb-1 font-bold">Professeur :</label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="tooltip-select">
                                <option value="" disabled>
                                    Choisir un professeur
                                </option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.code} value={teacher.code}>
                                        {teacher.code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 bg-gray-200 p-2 rounded-b-xl">
                            <label className="block mb-1 font-bold">Durée (en heure):</label>
                            <input
                                type="number"
                                min={0}
                                max={50}
                                step="0.5"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                                className="w-full text-primary bg-white rounded-full ring-1 ring-primary pl-2"
                            />
                        </div>

                        <div className="mb-3 bg-gray-200 p-2 rounded-xl">
                            <label className="block mb-1 font-bold">Groupe :</label>
                            <select
                                value={groupList[selectedCol] || ""}
                                onChange={(e) => {
                                    const selectedIndex = groupList.indexOf(e.target.value);
                                    setSelectedCol(selectedIndex !== -1 ? selectedIndex : 0);
                                }}
                                className="tooltip-select">
                                <option value="" disabled>
                                    Choisir un groupe
                                </option>
                                {groupList.map((group, index) => (
                                    <option key={index} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="text-red-700 text-sm text-center w-full pb-2">{error}</p>}
                        <button onClick={handleSubmit} className="px-3 py-2 w-full btn-default">
                            Ajouter
                        </button>
                    </div>
                </NodePortal>
            )}
        </div>
    );
};

export default CourseButton;
