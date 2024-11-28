import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { courseTypes as initialCourseTypes } from "../../../constants";

export const CourseTypeButton = ({ courseTypes, setCourseTypes, updateCoursesForRemovedType }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [newCourseTypeName, setNewCourseTypeName] = useState("");
  const [newCourseTypeColor, setNewCourseTypeColor] = useState("#000000");

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCourseType = () => {
    if (
      newCourseTypeName.trim() &&
      !courseTypes.some((type) => type.name === newCourseTypeName)
    ) {
      setCourseTypes((prev) => [
        ...prev,
        { name: newCourseTypeName.trim(), color: newCourseTypeColor },
      ]);
      setNewCourseTypeName("");
      setNewCourseTypeColor("#000000");
    }
  };

  const handleRemoveCourseType = (name) => {
    if (!initialCourseTypes.some((type) => type.name === name)) {
      setCourseTypes((prev) => prev.filter((type) => type.name !== name));
      updateCoursesForRemovedType(name);
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
      )}
    </div>
  );
};

export default CourseTypeButton;

