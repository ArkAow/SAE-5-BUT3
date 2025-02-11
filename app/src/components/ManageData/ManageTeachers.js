import React, { useState } from "react";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import useTeachers from "../../hooks/useTeachers.js";
import DepartmentSelect from "./DepartmentSelect.js";
import Navigation from "./Navigation.js";
import TeacherAddingForm from "../forms/TeacherAddingForm.js";
import { useUserContext } from "../../contexts/UserContext.js";
import TeacherUpdatingForm from "../forms/TeacherUpdatingForm.js";
import TeacherDeletingForm from "../forms/TeacherDeletingForm.js";

const ManageTeachers = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const { departments } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || null);
  const { teachers, isLoading: isTeacherLoading, isSaving, addTeacherForDepartment, updateTeacher, deleteTeacherForDepartment } = useTeachers(setToast, selectedDepartment);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(false);
  const [updatedTeacher, setUpdatedTeacher] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(false);
  const [deletedTeacher, setDeletedTeacher] = useState(false);


  const handleClickingTeacher = (teacher) => {
    setSelectedTeacher(teacher);
  }

  const handleClickingAddButton = () => {
    setAddingTeacher(true);
  }

  const handleClickingUpdateButton = (teacher) => {
    setUpdatedTeacher(teacher);
    setUpdatingTeacher(true);
  }

  const handleClickingDeleteButton = (teacher) => {
    setDeletedTeacher(teacher);
    setDeletingTeacher(true);
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

          {/* Liste des enseignants */}
          <div className="w-1/2 min-w-[300px] h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Enseignants
            </h2>
            {isTeacherLoading ? (
              <div className="flex flex-col items-center justify-center  p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                <div className="spinner"></div>
                <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des enseignants...</div>
              </div>
            ) : (
              <>
                {teachers.length === 0 ? (
                  <span className="w-full text-center text-white">Il n'y a pas d'enseignants dans le département "{selectedDepartment.name}"</span>
                ) : (
                  <ul className="space-y-4">
                    {teachers.map((teacher) => (
                      <li 
                        key={teacher.id}
                        className={`flex items-center rounded-lg p-2 ${ selectedTeacher == teacher ? "bg-gray-300" : "bg-white cursor-pointer"}`}
                        onClick={() => handleClickingTeacher(teacher)}>
                        <div className="text-base text-black w-full flex flex-row ml-2 justify-around" title={`${teacher.firstName} ${teacher.lastName}, ${teacher.isPartimeTutor ? "enseigant" : "vacataire"}`}>
                          <span className="w-fit text-left font-semibold"> {teacher.code} </span>
                          <span className="w-fit truncate text-left"> {teacher.firstName} </span>
                          <span className="w-fit truncate text-left"> {teacher.lastName} </span>
                          <span className="w-fit truncate text-right"> {teacher.isPartimeTutor ? "Vacataire" : "Enseigant"} </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                          className="size-6 flex justify-center items-center"
                          onClick={() => handleClickingUpdateButton(teacher)}>
                            <img src="images/pen.svg" alt="Modifier" className="size-6" />
                          </button>
                          <button 
                          className="size-6 flex justify-center items-center"
                          onClick={() => handleClickingDeleteButton(teacher)}>
                            <img src="images/trash.svg" alt="Supprmer" className="size-6" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button 
                className="w-full h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto"
                onClick={handleClickingAddButton}>
                  <span>Ajouter</span>
                </button>
              </>
            )}
          </div>

          {/* Enseignements des enseignants */}
          <div className="w-1/2 min-w-[300px] h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Enseignements
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {selectedTeacher ? (
                selectedTeacher.subjects && selectedTeacher.subjects.length > 0 ? (
                  <ul className="text-white">
                    {selectedTeacher.subjects.map((subject, index) => (
                      <li key={index} className="bg-gray-800 p-2 rounded-lg shadow">
                        {subject}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white text-center">
                    Aucun enseignement pour {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </p>
                )
              ) : (
                <p className="text-white text-center">Veuillez sélectionner un enseignant</p>
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>
        </div>
      </div>
      {addingTeacher && (
        <TeacherAddingForm 
          addTeacherForDepartment={addTeacherForDepartment}
          setAddingTeacher={setAddingTeacher}
          isSaving={isSaving}/>
      )}

      {updatingTeacher && (
        <TeacherUpdatingForm
          teacher={updatedTeacher} 
          updateTeacher={updateTeacher}
          setUpdatingTeacher={setUpdatingTeacher}
          isSaving={isSaving}/>
      )}

      {deletingTeacher && (
        <TeacherDeletingForm
          teacher={deletedTeacher}
          department={selectedDepartment}
          deleteTeacherForDepartment={deleteTeacherForDepartment}
          setDeletingTeacher={setDeletingTeacher}
          isSaving={isSaving}/>
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

export default ManageTeachers;
