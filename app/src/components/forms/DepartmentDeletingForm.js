import React from "react";

const DepartmentDeletingForm = ({department, deleteDepartment, setDeletingDepartment}) => {
  const handleCancelDeletingDepartment = () => {
    setDeletingDepartment(false);
  }

  const handleDeletingDepartment = () => {
    deleteDepartment(department.id);
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl text-center font-bold mb-4">
            Voulez-vous vraiment supprimer le département "{department.name}"?
          </h2>
          <form onSubmit={handleDeletingDepartment} className="space-y-2">
            <div className="flex justify-center space-x-2 w-full">
              <button type="button" onClick={handleCancelDeletingDepartment} className="btn-default p-2">
                  Retour
              </button>
              <button type="submit" className="btn-default p-2">
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