import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const GroupButton = ({ addGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [subGroupName, setSubGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  const [isNoGroups, setIsNoGroups] = useState(true);
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
          ) { setIsFocused(false); }};

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

  const handleAddGroup = () => {
    if (groupName.trim() !== "") {
      const newGroup = { name: groupName, subGroups: [] };
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      setGroupName("");
      addGroups(updatedGroups);
      setIsNoGroups(false);
    }
  };
  
  const handleAddSubGroup = (index) => {
    if (subGroupName.trim() !== "") {
      const updatedGroups = [...groups];
      const parentGroup = updatedGroups[index];
      const newSubGroupName = `${parentGroup.name}${subGroupName}`;
      parentGroup.subGroups.push(newSubGroupName);
      setGroups(updatedGroups);
      addGroups(updatedGroups);
      setSubGroupName("");
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setIsFocused(true)}
        className={`btn-control-panel ${isFocused ? "bg-white shadow-lg" : ""} transition duration-300`}>

        <span className={`absolute right-1 top-1 flex h-3 w-3 ${!isNoGroups ? "hidden" : ""}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>

        <img src="/images/group.svg" alt="group icon" className="w-10 h-10" />
      </button>

      {/* Tooltip rendu dans le portail global */}
      {isFocused && (
        <NodePortal>
          <div
            className="absolute top-52 left-32 bg-white p-5 rounded-lg shadow-lg w-80 text-xs"
            ref={tooltipRef}>

            <input
              type="text"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength="8"
              className="w-full p-2 mb-3 border rounded"
            />
            <button
              onClick={handleAddGroup}
              className="w-full p-2 btn-default">
              Ajouter Groupe
            </button>

            <div className={`mt-4 max-h-48 overflow-y-auto custom-scrollbar-light bg-gray-200 rounded-lg p-3
              ${isNoGroups ? "hidden" : ""}`}>
              
              {groups.map((group, index) => (
                <div key={index} className="mb-4 flex items-start justify-between">
                  <div className="font-semibold text-lg">
                    {group.name}
                    {group.subGroups.map((subGroup, subIndex) => (
                      <div key={subIndex} className="ml-4 text-sm text-gray-600">
                        - {subGroup}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col items-start ml-4">
                    <div className="flex flex-col items-start mt-2">
                      <input
                        type="text"
                        value={subGroupName}
                        onChange={(e) => setSubGroupName(e.target.value)}
                        maxLength="8"
                        className="w-36 p-2 mb-2 border rounded"
                      />
                      <button
                        onClick={() => handleAddSubGroup(index)}
                        className="w-36 p-2 btn-default">
                        Ajouter Sous-Groupe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>    
        </NodePortal>
      )}
    </div>
  );
};


export default GroupButton;