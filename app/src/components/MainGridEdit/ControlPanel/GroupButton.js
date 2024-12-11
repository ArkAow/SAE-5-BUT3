import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import routes from "../../../Routes/routes";

export const GroupButton = ({ curriculum, groups, setGroups, setToast, isNoGroups  }) => {
  const [groupName, setGroupName] = useState("");
  const [subGroupName, setSubGroupName] = useState("");
  const [error, setError] = useState("");
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
    return createPortal(children, document.getElementById("portal-root"));
  };

  const addGroups = async (newGroups) => {
    const actualClassID = curriculum.classes[0].id;
    const filteredNewGroups = newGroups.filter(
      (newGroup) => !groups.some((g) => g.name === newGroup.name)
    );
    if (filteredNewGroups.length === 0) return;
    setGroups((prevGroups) => [...prevGroups, ...filteredNewGroups]);
    for (const group of filteredNewGroups) {
      try {
        const response = await fetch(routes.dev.groups.addGroups(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: group.name,
            halfgroups: group.subGroups || [],
            classID: actualClassID,
          }),
        });
        if (!response.ok) {
          const error = await response.json();
          setToast({
            message: error.message || "Erreur lors de l'ajout du groupe",
            type: "error",
            visible: true,
          });
          continue;
        }
        const result = await response.json();
        console.log("Le groupe a été ajouté avec succès :", result);
        setToast({
          message: "Le groupe a été ajouté avec succès !",
          type: "success",
          visible: true,
        });
      } catch (error) {
        console.error("Erreur lors de la connexion avec l'API:", error);
        setToast({
          message: "Erreur de connexion au serveur.",
          type: "error",
          visible: true,
        });
      }
    }
  };
  
  const deleteGroups = async (index) => {
    const group = groups[index];
    try {
      const response = await fetch(routes.dev.groups.deleteGroup(group.id), {
        method: "DELETE",
      });
      if (response.ok) {
        setGroups(groups.filter((_, i) => i !== index));
        setToast({
          message: "Le groupe a été supprimé avec succès !",
          type: "success",
          visible: true,
        });
      } else {
        setToast({
          message: "Erreur lors de la suppression du groupe.",
          type: "error",
          visible: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error);
      setToast({
        message: "Erreur de connexion au serveur.",
        type: "error",
        visible: true,
      });
    }
  };
  
  const deleteHalfGroups = async (groupIndex, index) => {
    const group = groups[groupIndex];
    const halfGroup = group.subGroups[index];
    try {
      const response = await fetch(routes.dev.groups.deleteSubGroup(halfGroup.id), {
        method: "DELETE",
      });
  
      if (response.ok) {
        setGroups((prevGroups) =>
          prevGroups.map((g, i) =>
            i === groupIndex
              ? { ...g, subGroups: g.subGroups.filter((_, subIndex) => subIndex !== index) }
              : g
          )
        );
        setToast({
          message: "Le sous-groupe a été supprimé avec succès !",
          type: "success",
          visible: true,
        });
      } else {
        setToast({
          message: "Erreur lors de la suppression du sous-groupe.",
          type: "error",
          visible: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du sous-groupe:", error);
      setToast({
        message: "Erreur de connexion au serveur.",
        type: "error",
        visible: true,
      });
    }
  };
  
  const addSubGroups = async (groupId, newSubGroup, index) => {
    try {
      const response = await fetch(routes.dev.groups.addSubGroups(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSubGroup.name,
          group_id: groupId,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        setToast({
          message: error.message || "Erreur lors de l'ajout du sous-groupe.",
          type: "error",
          visible: true,
        });
        return;
      }
      const result = await response.json();
      console.log("Le sous-groupe a été ajouté avec succès :", result);
      setGroups((prevGroups) => {
        const updatedGroups = [...prevGroups];
        const updatedGroup = { ...updatedGroups[index] };
        updatedGroup.subGroups = [...updatedGroup.subGroups, newSubGroup];
        updatedGroups[index] = updatedGroup;
        return updatedGroups;
      });

      setToast({
        message: "Le sous-groupe a été ajouté avec succès !",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du sous-groupe:", error);
      setToast({
        message: "Erreur de connexion au serveur.",
        type: "error",
        visible: true,
      });
    }
  };
  
  const handleAddGroup = () => {
    if (groupName.trim() === "") {
      setError("Nom de groupe vide");
      return;
    }
    if (groups.some((group) => group.name === groupName.trim())) {
      setError("Nom de groupe déjà existant");
      return;
    }
    setError("");
    addGroups([{ name: groupName.trim(), subGroups: [] }]);
    setGroupName("");
  };
  
  const handleAddSubGroup = (index) => {
    if (subGroupName.trim() === "") {
      setError("Nom de sous-groupe vide");
      return;
    }
    const parentGroup = groups[index];
    const fullSubGroupName = parentGroup.name + subGroupName.trim();
    if (parentGroup.subGroups.some((subGroup) => subGroup.name === fullSubGroupName)) {
      setError("Nom de sous-groupe déjà existant");
      return;
    }
    setError("");
    addSubGroups(parentGroup.id, { name: fullSubGroupName }, index);
    setSubGroupName("");
  };
  
  const handleDeleteGroup = deleteGroups;
  const handleDeleteSubGroup = deleteHalfGroups;
  

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsFocused(true)}
        className={`btn-control-panel ${
          isFocused ? "bg-white shadow-lg" : ""
        } transition duration-300`}>
        <span
          className={`absolute right-1 top-1 flex h-3 w-3 ${
            !isNoGroups ? "hidden" : ""
          }`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>

        <img src="/images/group.svg" alt="group icon" className="w-10 h-10" draggable="false" />
      </button>

      {/* Tooltip rendu dans le portail global */}
      {isFocused && (
        <NodePortal>
          <div className="tooltip" ref={tooltipRef}>
            <h3 className="mb-5 font-bold text-base">Modifier les groupes</h3>
            {error && <p className="text-red-700 text-sm text-center w-full">{error}</p>}
            <input
              type="text"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength="8"
              className="w-full p-2 mb-3 border rounded"/>
            <button onClick={handleAddGroup} className="w-full p-2 btn-default">
              Ajouter Groupe
            </button>

            <div
              className={`mt-4 max-h-48 overflow-y-auto custom-scrollbar-light bg-gray-200 rounded-lg p-3 ${
                isNoGroups ? "hidden" : ""
              }`}>
              {groups.map((group, index) => (
                <div key={index} className="mb-4 flex items-start justify-between">
                  <div className="font-semibold text-lg flex items-center">
                    {group.name}
                    <button
                      onClick={() => handleDeleteGroup(index)}
                      className="size-6 btn-default justify-items-center ml-2">
                      <img src="images/cross.svg" alt="cross" className="size-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-start mt-2 w-1/2">
                    <input
                      type="text"
                      value={subGroupName}
                      onChange={(e) => setSubGroupName(e.target.value)}
                      maxLength="8"
                      className="w-full p-2 mb-2 border rounded"/>
                    <button
                      onClick={() => handleAddSubGroup(index)}
                      className="w-full p-2 btn-default text-[0.6rem]">
                      Ajouter Sous-Groupe
                    </button>

                    {group.subGroups.map((subGroup, subIndex) => (
                      <div key={subIndex} className="flex items-center mt-2 w-full">
                        <span className="text-sm text-gray-600">{subGroup.name}</span>
                        <button
                          onClick={() => handleDeleteSubGroup(index, subIndex)}
                          className="size-4 btn-default justify-items-center ml-2">
                          <img src="images/cross.svg" alt="cross" className="size-3" />
                        </button>
                      </div>
                    ))}
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
