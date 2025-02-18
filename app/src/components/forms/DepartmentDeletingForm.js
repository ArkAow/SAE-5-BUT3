import React from "react";

const DepartmentDeletingForm = ({department, deleteDepartment, setDeletingDepartment, isSaving}) => {
  const handleLeaving = () => {
    setDeletingDepartment(false);
  }

  const handleDeletingDepartment = async () => {
    await deleteDepartment(department.id);
    handleLeaving()
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl text-center mb-4">
            Voulez-vous vraiment <span className="text-red-500 font-bold">supprimer</span> le département "{department.name}"?
          </h2>
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

export default DepartmentDeletingForm;