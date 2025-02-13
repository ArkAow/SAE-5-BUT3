import React, { useState } from "react";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import Navigation from "./Navigation.js";
import DepartmentSelect from "./DepartmentSelect.js";
import useGroups from "../../hooks/useGroups.js";
import { useUserContext } from "../../contexts/UserContext.js";

const ManageGroups = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  
  const { departments } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || null);
  
  const { formationLevels, isFormationLevelLoading} = useGroups(selectedDepartment.id, setToast)
  const [selectedFormationLevel, setSelectedFormationLevel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);

  const handleSelectFormationLevel = (formationLevel) => {
    setSelectedFormationLevel(formationLevel);
    setGroups(formationLevel.groups);
    setSelectedGroup(null);
    setSubGroups([]);
  }

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSubGroups(group.subGroups);
  }

  return (
    <>
      <Header />
      <Navigation />
      <DepartmentSelect 
        departments={departments} 
        selectedDepartment={selectedDepartment} 
        setSelectedDepartment={setSelectedDepartment} />

      <div className="min-h-screen flex flex-col justify-center items-center px-8">
        <div className="flex justify-around w-full mx-10 mt-40">
          
          {/* Niveaux de formation */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Niveaux de formation
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {isFormationLevelLoading ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des promotions...</div>
                </div>
              ) : (
                formationLevels.map((formationLevel) => (
                  <div
                    key={formationLevel.id}
                    onClick={() => handleSelectFormationLevel(formationLevel)}
                    className={`flex items-center rounded-lg py-2 px-4 ${
                      selectedFormationLevel?.id === formationLevel.id
                        ? "bg-gray-300"
                        : "bg-white cursor-pointer"}`}>
                    <span className="w-1/2 text-left font-semibold">{formationLevel.name}</span>
                    <span className="w-1/2 text-right font-semibold">{formationLevel.curriculums[0]?.name}</span>
                  </div>
                ))
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {!selectedFormationLevel ? (
                <p className="text-white text-center">Sélectionnez une promotion</p>
              ) : (
                <>
                  {groups.length === 0 ? ( 
                    <p className="text-white text-center">Aucun groupe pour les {selectedFormationLevel.name}</p>
                  ) : (
                    groups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => handleSelectGroup(group)}
                        className={`flex items-center rounded-lg p-2 ${
                          selectedGroup?.id === group.id ? "bg-gray-300" : "bg-white cursor-pointer"}`}>
                        <span className="w-full text-center font-semibold">{group.name}</span>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between" disabled={!selectedFormationLevel}>
              Ajouter
            </button>
          </div>

          {/* Demi-groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Demi-groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {!selectedGroup ? (
                <p className="text-white text-center">Sélectionnez un groupe</p>
              ) : (
                <>
                  {subGroups.length === 0 ? ( 
                    <p className="text-white text-center">Aucun sous-groupe pour le groupe {selectedGroup.name}</p>
                  ) : (
                    subGroups.map((subGroup) => (
                      <div
                        key={subGroup.id}
                        className="flex items-center rounded-lg p-2 bg-white">
                        <span className="w-full text-center font-semibold">{subGroup.name}</span>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between" disabled={!selectedGroup}>
              Ajouter
            </button>
          </div>
        </div>
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </>
  );
};

export default ManageGroups;