import React, { useState, useEffect } from "react";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import useTeachers from "../../hooks/useTeachers.js";
import DepartmentSelect from "./DepartmentSelect.js";
import Navigation from "./Navigation.js";
import TeacherAddingForm from "../forms/TeacherAddingForm.js";
import { useUserContext } from "../../contexts/UserContext.js";
import TeacherUpdatingForm from "../forms/TeacherUpdatingForm.js";
import TeacherDeletingForm from "../forms/TeacherDeletingForm.js";
import useSubjects from "../../hooks/useSubjects.js";
import TeachingAddingForm from "../forms/TeachingAddingForm.js";

const ManageTeachers = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const { departments } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || null);
  const { teachers, isLoading: isTeacherLoading, isSaving,
    addTeacherForDepartment, updateTeacher, deleteTeacherForDepartment,
    addSubjectForTeacher, deleteSubjectForTeacher } = useTeachers(setToast, selectedDepartment);
  const { subjects, isLoading: isSubjectsLoading } = useSubjects(null, selectedDepartment.id)
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [addingTeaching, setAddingTeaching] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(false);
  const [updatedTeacher, setUpdatedTeacher] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(false);
  const [deletedTeacher, setDeletedTeacher] = useState(false);
  
  useEffect(() => {
    setSelectedTeacher(null);
  }, [selectedDepartment]);

  const handleClickingTeacher = (teacher) => {
    setSelectedTeacher(teacher);
  }

  const handleClickingAddTeacherButton = () => {
    setAddingTeacher(true);
  }

  const handleClickingAddTeachingButton = () => {
    setAddingTeaching(true);
  }

  const handleClickingUpdateButton = (teacher) => {
    setUpdatedTeacher(teacher);
    setUpdatingTeacher(true);
  }

  const handleClickingDeleteTeacher = (teacher) => {
    setDeletedTeacher(teacher);
    setDeletingTeacher(true);
  }

  const handleClickingDeleteTeaching = (subject) => {
    deleteSubjectForTeacher(selectedTeacher.id, subject.id);
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
              <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
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
                          onClick={() => handleClickingDeleteTeacher(teacher)}>
                            <img src="images/trash.svg" alt="Supprmer" className="size-6" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button 
                className="w-full h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto"
                onClick={handleClickingAddTeacherButton}>
                  <span>Ajouter</span>
                </button>
              </>
            )}
          </div>

          {/* Enseignements des enseignants */}
          <div className="w-1/2 min-w-[300px] h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white items-center text-center text-lg font-bold mb-4">
              Matière(s) enseignée(s) <span className="text-sm font-normal">{selectedTeacher ? `par ${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ""}</span>
            </h2>
            <div className="w-full space-y-2 flex flex-col overflow-auto">
              {selectedTeacher ? (
                <>
                  {selectedTeacher.subjects && selectedTeacher.subjects.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedTeacher.subjects.map((subject, index) => (
                        <li key={index} className="flex items-center justify-between rounded-lg p-2 text-left bg-white">
                          <p className="truncate w-5/6">{subject.name}</p>
                          <button 
                          className="size-6 flex justify-center items-center"
                          onClick={() => handleClickingDeleteTeaching(subject)}>
                            <img src="images/trash.svg" alt="Supprmer" className="size-6" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="w-full text-center text-white">
                      Aucun enseignement pour {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </p>
                  )}
                  <button
                    className="w-full h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto"
                    onClick={handleClickingAddTeachingButton}>
                    <span>Ajouter</span>
                  </button>
                </>
              ) : (
                <p className="w-full text-center text-white">Veuillez sélectionner un enseignant</p>
              )}
            </div>
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

      {addingTeaching && (
        <TeachingAddingForm
          teacher={selectedTeacher}
          subjects={subjects}
          addSubjectForTeacher={addSubjectForTeacher}
          isSaving={isSaving}
          setAddingTeaching={setAddingTeaching}/>
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
