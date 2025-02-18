import React from "react";

const TeacherDeletingForm = ({teacher, department, deleteTeacherForDepartment, setDeletingTeacher, isSaving}) => {
  const handleLeaving = () => {
    setDeletingTeacher(false);
  }

  const handleDeletingDepartment = async () => {
    await deleteTeacherForDepartment(teacher.id, department.id);
    handleLeaving()
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl text-center mb-4">
            Voulez-vous vraiment <span className="text-red-500 font-bold">supprimer</span> l'enseignant {teacher.firstName} {teacher.lastName} du 
            département {department.name} ?
          </h2>
          <p className="text-base text-center mb-4">
            <span className="text-red-500 font-bold">/!\</span> Si l'enseignant appartient à aucun autre département, il sera supprimé de la base de données
          </p>
          <form onSubmit={handleDeletingDepartment} className="space-y-2">
            <div className="flex justify-center space-x-2 w-full">
              <button type="button" onClick={handleLeaving} className="btn-default p-2" disabled={isSaving}>
                  Retour
              </button>
              <button type="submit" className="btn-default p-2" disabled={isSaving}>
                  Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TeacherDeletingForm;