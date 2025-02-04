import React, { useState } from "react";

const DepartmentUpdatingForm = ({department, updateDepartment, curriculums, setUpdatingDepartment, isCurriculumLoading}) => {
  const [departmentCurriculums, setDepartmentCurriculums] = useState(department.curriculums || []);
  const [departmentName, setDepartmentName] = useState(department.name);
  const [error, setError] = useState("");

  const handleCancelAddingDepartment = () => {
    setDepartmentCurriculums([]);
    setDepartmentName("");
    setUpdatingDepartment(false);
  }

  const handleToggleCurriculum = (curriculum) => {
    if (departmentCurriculums.some((c) => c.id === curriculum.id)) {
      setDepartmentCurriculums(departmentCurriculums.filter((c) => c.id !== curriculum.id));
    } else {
      setDepartmentCurriculums([...departmentCurriculums, curriculum]);
    }
  };

  const handleUpdatingDepartment = () => {
    if (!departmentName.trim()) {
      setError("Le nom du département ne peux pas être vide.");
      return;
    }
    setError("");
    const payload = {
      id: department.id,
      name: departmentName,
      curriculums: departmentCurriculums.map((c) => c.id),
    };
    updateDepartment(payload);
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="tooltip-centered-bigger min-w-[345px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Modifier le département "{department.name}"</h2>
          <form onSubmit={handleUpdatingDepartment} className="space-y-2">
            <div>
                <label className="block mb-1">Nom du département :</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                  required/>
            </div>
            {isCurriculumLoading ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[100px] h-max">
                    Chargement des cursus...
                  </div>
              </div>
            ) : (
              <>
                {curriculums.length === 0 ? (
                  <span className="w-full text-center">Il n'y a pas de cursus</span>
                ) : (
                  <div className="space-y-2">
                    <label className="block mb-1">Selectionnez les cursus :</label>
                    <div className="flex flex-wrap gap-2 w-full justify-start">
                      {curriculums.map((curriculum) => {
                        const isSelected = departmentCurriculums.some((c) => c.id === curriculum.id);
                        return (
                          <button
                            key={curriculum.id}
                            type="button"
                            className={`px-4 py-2 rounded-md transition-all 
                              ${isSelected ?
                                "bg-primarytint text-white" :
                                "bg-primary text-white hover:bg-primaryshade"}`}
                            onClick={() => handleToggleCurriculum(curriculum)}>
                            {curriculum.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-4">
              <p className="font-bold">Cursus sélectionnés :</p>
              <ul className="list-disc list-inside">
                {departmentCurriculums.length == 0 ? (
                  <li key={0}> Auncun cursus selectionné</li>
                ) : (
                  <>
                    {departmentCurriculums.map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </>
                )}
              </ul>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center space-x-2 w-full">
              <button type="button" onClick={handleCancelAddingDepartment} className="btn-default p-2">
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

export default DepartmentUpdatingForm;