import React from "react";

const DepartmentDeletingForm = ({department, deleteDepartment, setDeletingDepartment, isSaving}) => {
  const handleLeaveDeletingDepartment = () => {
    setDeletingDepartment(false);
  }

  const handleDeletingDepartment = async () => {
    await deleteDepartment(department.id);
    handleLeaveDeletingDepartment()
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl text-center font-bold mb-4">
            Voulez-vous vraiment supprimer le département "{department.name}"?
          </h2>
          <form onSubmit={handleDeletingDepartment} className="space-y-2">
            <div className="flex justify-center space-x-2 w-full">
              <button type="button" onClick={handleLeaveDeletingDepartment} className="btn-default p-2" disabled={isSaving}>
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