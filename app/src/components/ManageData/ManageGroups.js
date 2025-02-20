import React, { useEffect, useState } from "react";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import Navigation from "./Navigation.js";
import useGroups from "../../hooks/useGroups.js";
import DepartmentSelect from "./DepartmentSelect.js";
import { useUserContext } from "../../contexts/UserContext.js";
import FormationLevelAddingForm from "../forms/FormationLevelAddingForm.js";
import FormationLevelDeletingForm from "../forms/FormationLevelDeletingForm.js";
import GroupAddingForm from "../forms/GroupAddingForm.js";
import GroupDeletingForm from "../forms/GroupDeletingForm.js";
import SubgroupDeletingForm from "../forms/SubgroupDeletingForm.js";
import SubgroupAddingForm from "../forms/SubgroupAddingForm.js";

const ManageGroups = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  
  const { departments } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || null);
  
  const { formationLevels, isFormationLevelLoading, isSaving,
    addGroup, addFormationLevel, deleteFormationLevel, deleteGroup,
    addSubgroup, deleteSubgroup } = useGroups(selectedDepartment, setToast)
  const [selectedFormationLevel, setSelectedFormationLevel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);

  const [addingFormationLevel, setAddingFormationLevel] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);
  const [addingSubGroup, setAddingSubGroup] = useState(false);

  const [deletingFormationLevel, setDeletingFormationLevel] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [deletingSubGroup, setDeletingSubGroup] = useState(false);
  const [deletedFormationLevel, setDeletedFormationLevel] = useState(null);
  const [deletedGroup, setDeletedGroup] = useState(null);
  const [deletedSubGroup, setDeletedSubGroup] = useState(null);

  useEffect(() => {
    setGroups([]);
    setSubGroups([]);
    setSelectedFormationLevel(null);
    setSelectedGroup(null);
  }, [formationLevels]);

  const handleClickingFormationLevel = (formationLevel) => {
    setSelectedFormationLevel(formationLevel);
    setGroups(formationLevel.groups);
    setSelectedGroup(null);
    setSubGroups([]);
  }

  const handleClinkingGroup = (group) => {
    setSelectedGroup(group);
    setSubGroups(group.subGroups);
  }

  const handleClickingAddFormationLevelButton = () => {
    setAddingFormationLevel(true);
  }

  const handleClickingDeleteFormationLevelButton = (formationLevel) => {
    setDeletedFormationLevel(formationLevel);
    setDeletingFormationLevel(true);
  }

  const handleClickingAddGroupButton = () => {
    setAddingGroup(true);
  }

  const handleClickingDeleteGroupButton = (group) => {
    setDeletedGroup(group);
    setDeletingGroup(true);
  }

  const handleClickingAddSubgroupButton = () => {
    setAddingSubGroup(true);
  }

  const handleClickingDeleteSubgroupButton = (subgroup) => {
    setDeletedSubGroup(subgroup);
    setDeletingSubGroup(true);
  }

  console.log(formationLevels);

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
              ) : formationLevels.length === 0 ? (
                <p className="text-white text-center">Aucun niveau de formation pour le département {selectedDepartment.name}</p>
              ) : (
                formationLevels.map((formationLevel) => (
                  <div
                    key={formationLevel.id}
                    onClick={() => handleClickingFormationLevel(formationLevel)}
                    className={`flex items-center justify-between rounded-lg py-2 px-4 ${
                      selectedFormationLevel?.id === formationLevel.id
                        ? "bg-gray-300"
                        : "bg-white cursor-pointer"}`}>
                    <span className="w-fit text-left font-semibold">{formationLevel.name}</span>
                    <span className="w-fit text-right font-semibold truncate">{formationLevel.curriculums[0]?.name}</span>
                    <button 
                    className="size-6 flex justify-center items-center">
                      <img src="images/trash.svg" alt="Supprimer" className="size-6" onClick={() => handleClickingDeleteFormationLevelButton(formationLevel)}/>
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between" onClick={handleClickingAddFormationLevelButton}>
              Ajouter
            </button>
          </div>

          {/* Groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Groupes {selectedFormationLevel ? `${selectedFormationLevel.name}` : ``}
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
                        onClick={() => handleClinkingGroup(group)}
                        className={`flex items-center rounded-lg p-2 justify-between ${
                          selectedGroup?.id === group.id ? "bg-gray-300" : "bg-white cursor-pointer"}`}>
                        <span className="w-fit text-center font-semibold">{group.name}</span>
                        <button 
                        className="size-6 flex justify-center items-center" onClick={() => handleClickingDeleteGroupButton(group)}>
                          <img src="images/trash.svg" alt="Supprimer" className="size-6" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between" disabled={!selectedFormationLevel} onClick={handleClickingAddGroupButton}>
              Ajouter
            </button>
          </div>

          {/* Demi-groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Demi-groupes {selectedGroup ? `${selectedGroup.name}` : ``}
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
                        className="flex items-center rounded-lg p-2 bg-white justify-between">
                        <span className="w-fit text-center font-semibold">{subGroup.name}</span>
                        <button className="size-6 flex justify-center items-center" onClick={() => handleClickingDeleteSubgroupButton(subGroup)}>
                          <img src="images/trash.svg" alt="Supprimer" className="size-6" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between" disabled={!selectedGroup} onClick={handleClickingAddSubgroupButton}>
              Ajouter
            </button>
          </div>
        </div>
      </div>
      
      {addingFormationLevel && (
        <FormationLevelAddingForm 
          addFormationLevel={addFormationLevel}
          isSaving={isSaving}
          selectedDepartment={selectedDepartment}
          setAddingFormationLevel={setAddingFormationLevel}/>
      )}

      {addingGroup && (
        <GroupAddingForm 
          addGroup={addGroup}
          isSaving={isSaving}
          selectedFormationLevel={selectedFormationLevel}
          setAddingGroup={setAddingGroup}/>
      )}

      {addingSubGroup && (
        <SubgroupAddingForm 
          addSubgroup={addSubgroup}
          isSaving={isSaving}
          selectedGroup={selectedGroup}
          setAddingSubgroup={setAddingSubGroup}/>
      )}

      {deletingFormationLevel && (
        <FormationLevelDeletingForm 
          deleteFormationLevel={deleteFormationLevel}
          formationLevel={deletedFormationLevel}
          isSaving={isSaving}
          setDeletingFormationLevel={setDeletingFormationLevel}/>
      )}

      {deletingGroup && (
        <GroupDeletingForm 
          deleteGroup={deleteGroup}
          group={deletedGroup}
          isSaving={isSaving}
          setDeletingGroup={setDeletingGroup}/>
      )}

      {deletingSubGroup && (
        <SubgroupDeletingForm 
          deleteSubgroup={deleteSubgroup}
          isSaving={isSaving}
          setDeletingSubgroup={setDeletingSubGroup}
          subgroup={deletedSubGroup}/>
      )}

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