import React, { useState } from "react";

export const GroupButton = ({ addGroups }) => {
  const [groupsData, setGroupsData] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [halfGroups, setHalfGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNoGroups, setIsNoGroups] = useState(true);

  const handleAddGroup = () => {
    const newGroup = { name: groupName, halfGroups: halfGroups };

    setGroupsData([...groupsData, newGroup]);
    setGroupName("");
    setHalfGroups([]);
    addGroups([...groupsData, newGroup]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="btn-control-panel">

        <span className={`absolute right-1 top-1 flex h-3 w-3 ${!isNoGroups ? "hidden" : ""}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>

        <img src="/images/group.svg" alt="group icon" className="w-10 h-10" />
      </button>
      
      {isOpen && (
        <div className="absolute top-12 left-0 bg-white p-5 rounded-lg shadow-lg w-72">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nom du groupe"
            className="w-full p-2 mb-3 border rounded"/>
          <button
            onClick={handleAddGroup}
            className="w-full p-2 bg-primary text-white rounded">Ajouter Groupe</button>
        </div>
      )}
    </div>
  );
};


export default GroupButton;