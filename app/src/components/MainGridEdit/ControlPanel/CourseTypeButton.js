import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { courseTypes as initialCourseTypes } from "../../../constants";

export const CourseTypeButton = ({ courseTypes, setCourseTypes, updateCoursesForRemovedType }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [newCourseTypeName, setNewCourseTypeName] = useState("");
  const [newCourseTypeColor, setNewCourseTypeColor] = useState("#000000");
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const NodePortal = ({ children }) => {
    return createPortal(children, document.getElementById("portal-root"));
  };

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

  const handleAddCourseType = async () => {
    if (!newCourseTypeName.trim()) {
      setError("Le nom du type de cours est obligatoire.");
      return;
    }

    try {
      const response = await fetch("/add/coursetype", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCourseTypeName.trim(),
          color: newCourseTypeColor,
        }),
      });

      if (response.status === 201) {
        setCourseTypes((prev) => [
          ...prev,
          { name: newCourseTypeName.trim(), color: newCourseTypeColor },
        ]);
        setNewCourseTypeName("");
        setNewCourseTypeColor("#000000");
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de l'ajout du type de cours.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de cours :", error);
      setError("Erreur lors de l'ajout du type de cours.");
    }
  };

  const handleRemoveCourseType = async (name) => {
    const courseType = courseTypes.find((type) => type.name === name);
    if (!courseType) return;

    try {
      const response = await fetch(`/delete/coursetype/${courseType.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCourseTypes((prev) => prev.filter((type) => type.name !== name));
        updateCoursesForRemovedType(name);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la suppression du type de cours.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du type de cours :", error);
      setError("Erreur lors de la suppression du type de cours.");
    }
  };

  return (
    <div ref={containerRef}>
      <button
        onClick={() => setIsFocused(true)}
        className={`btn-control-panel ${
          isFocused ? "bg-white shadow-lg" : ""
        } transition duration-300`}>
        <img
          src="/images/book.svg"
          alt="course type icon"
          className="w-10 h-10"
          draggable="false"/>
      </button>
      {isFocused && (
        <NodePortal>
          <div
            className="tooltip p-5 bg-white rounded-lg shadow-lg max-w-xs"
            ref={tooltipRef}>
            <h3 className="mb-3 font-bold text-base">
              Modifier les types de cours
            </h3>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <ul className="mb-3">
              {courseTypes.map((type) => (
                <li
                  key={type.name}
                  className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color }}></span>
                    <span>{type.name}</span>
                  </div>
                  {!initialCourseTypes.some(
                    (initialType) => initialType.name === type.name
                  ) && (
                    <button
                      className="btn-default py-1 px-2"
                      onClick={() => handleRemoveCourseType(type.name)}>
                      Supprimer
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nom du type de cours"
                className="p-2 border rounded"
                value={newCourseTypeName}
                onChange={(e) => setNewCourseTypeName(e.target.value)}/>
              <input
                type="color"
                value={newCourseTypeColor}
                onChange={(e) => setNewCourseTypeColor(e.target.value)}/>
              <button
                onClick={handleAddCourseType}
                className="w-full p-2 btn-default">
                Ajouter
              </button>
            </div>
          </div>
        </NodePortal>
      )}
    </div>
  );
};

export default CourseTypeButton;
