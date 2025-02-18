import React, { useState } from "react";
import Header from "../header/header.js";
import Navigation from "./Navigation.js";
import useDepartments from "../../hooks/useDepartments.js";
import useCurriculums from "../../hooks/useCurriculums.js";
import DepartmentAddingForm from "../forms/DepartmentAddingForm.js";
import DepartmentUpdatingForm from "../forms/DepartmentUpdatingingForm.js";
import DepartmentDeletingForm from "../forms/DepartmentDeletingForm.js";
import Toast from "../Toast/Toast.js";

const ManageDepartments = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const {curriculums, isLoading: isCurriculumLoading} = useCurriculums();
  const {departments, isLoading: isDepartmentLoading, isSaving, addDepartment, updateDepartment, deleteDepartment} = useDepartments(setToast);

  const [addingDepartment, setAddingDepartment] = useState(false);
  const [updatingDepartment, setUpdatingDepartment] = useState(false);
  const [updatedDepartment, setUpdatedDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(false);
  const [deletedDepartment, setDeletedDepartment] = useState(null);

  const handleClickingAddButton = () => {
    setAddingDepartment(true);
  }

  const handleClickingUpdateButton = (department) => {
    setUpdatedDepartment(department);
    setUpdatingDepartment(true);
  }

  const handleClickingDeleteButton = (department) => {
    setDeletedDepartment(department);
    setDeletingDepartment(true);
  }

  return (
    <>
      <Header />
      <Navigation />

      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center w-full mt-40">
          <div className="w-full mx-10 h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
              <h2 className="text-white text-center text-lg font-bold mb-4">
                Départements
              </h2>

              {isDepartmentLoading ? (
                <div className="flex flex-col items-center justify-center  p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des départements...</div>
                </div>
              ) : (
                <>
                  {departments.length === 0 ? (
                    <span className="w-full text-center text-white">Il n'y a pas de départements</span>
                  ) : (
                    <ul className="space-y-4">
                      {departments.map((department) => (
                        <li key={department.id} className="flex items-center bg-white rounded-lg p-2">
                          <div className="text-base text-black w-full flex flex-row ml-2 mr-12">
                            <span className="w-1/3 text-left font-semibold"> {department.name} </span>
                            <span className="w-1/3 text-left"> {department.curriculums?.length} cursus associés </span>
                            <span className="w-1/3 text-left"> {department.users?.length} membres </span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                            className="size-6 flex justify-center items-center"
                            onClick={() => handleClickingUpdateButton(department)}>
                              <img src="images/pen.svg" alt="Modifier" className="size-6" />
                            </button>
                            <button 
                            className="size-6 flex justify-center items-center"
                            onClick={() => handleClickingDeleteButton(department)}>
                              <img src="images/trash.svg" alt="Supprmer" className="size-6" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button 
                  className="w-[35%] h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto"
                  onClick={handleClickingAddButton}>
                    <span>Ajouter</span>
                  </button>
                </>
              )}
          </div>

          {addingDepartment && (
            <DepartmentAddingForm 
              addDepartment={addDepartment}
              setAddingDepartment={setAddingDepartment}
              curriculums={curriculums}
              isCurriculumLoading={isCurriculumLoading}
              isSaving={isSaving}/>
          )}

          {updatingDepartment && (
            <DepartmentUpdatingForm
              department={updatedDepartment}
              updateDepartment={updateDepartment}
              curriculums={curriculums}
              setUpdatingDepartment={setUpdatingDepartment}
              isCurriculumLoading={isCurriculumLoading}
              isSaving={isSaving}/>
          )}

          {deletingDepartment && (
            <DepartmentDeletingForm
              department={deletedDepartment}
              deleteDepartment={deleteDepartment}
              setDeletingDepartment={setDeletingDepartment}
              isSaving={isSaving}/>
          )}
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

export default ManageDepartments;