import React, { useState } from "react";

const DepartmentAddingForm = ({addDepartment, curriculums, setAddingDepartment, isCurriculumLoading}) => {
  const [departmentCurriculums, setDepartmentCurriculums] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState("");

  const handleCancelAddingDepartment = () => {
    setDepartmentCurriculums([]);
    setDepartmentName("");
    setAddingDepartment(false);
  }

  const handleAddCurriculum = (curriculum) => {
    if (!departmentCurriculums.some((c) => c.id === curriculum.id)) {
      setDepartmentCurriculums([...departmentCurriculums, curriculum]);
    }
  };

  const handleAddingDepartment = () => {
    if (!departmentName.trim()) {
      setError("Le nom du département est obligatoire.");
      return;
    }
    setError("");
    addDepartment(departmentName, departmentCurriculums.map((c) => c.id));
  }

  return (
    <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="tooltip-centered-bigger min-w-[345px] w-1/3">
            <h2 className="text-2xl font-bold mb-4">Ajouter un département</h2>
            <form onSubmit={handleAddingDepartment} className="space-y-2">
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
                        {curriculums.map((curriculum) => (
                            <button
                            key={curriculum.id}
                            type="button"
                            className={`px-4 py-2 rounded-md ${
                            departmentCurriculums.some((c) => c.id === curriculum.id)
                                ? "bg-primarytint text-white cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primaryshade"
                            }`}
                            onClick={() => handleAddCurriculum(curriculum)}
                            disabled={departmentCurriculums.some((c) => c.id === curriculum.id)}>
                            {curriculum.name}
                            </button>
                        ))}
                        </div>
                    </div>
                    )}
                </>
                )}

                <div className="mt-4">
                <p className="font-bold">Cursus sélectionnés :</p>
                <ul className="list-disc list-inside">
                    {departmentCurriculums.length == 0 ? (
                    <li> Auncun cursus selectionné</li>
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
                    Annuler
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

export default DepartmentAddingForm;