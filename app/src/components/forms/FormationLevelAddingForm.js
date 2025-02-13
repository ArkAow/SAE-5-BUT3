import React, { useState } from "react";

const FormationLevelAddingForm = ({selectedDepartment, addFormationLevel, setAddingFormationLevel, isSaving}) => {
  const [formationLevelName, setFormationLevelName] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setFormationLevelName("");
    setSelectedCurriculum("");
    setAddingFormationLevel(false);
  }

  const handleAddingDepartment = async (e) => {
    e.preventDefault();
    
    if (!formationLevelName.trim()) {
      setError("Le nom de la promotion est obligatoire.");
      return;
    }
    if (!selectedCurriculum) {
      setError("Le choix d'un curriculum est obligatoire.");
      return;
    }

    setError("");
    const payload = {
      name: formationLevelName,
      departmentId: selectedDepartment.id,
      curriculumId: selectedCurriculum,
    };
    console.log(payload);
    await addFormationLevel(payload);
    handleLeaving();
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Ajouter une promotion</h2>
          <form onSubmit={handleAddingDepartment} className="space-y-2">
            <div>
              <label className="block mb-1 font-bold">Nom de la promotion<span className="text-red-500">*</span> :</label>
              <input
                type="text"
                value={formationLevelName}
                onChange={(e) => setFormationLevelName(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
            </div>

            <div>
              <label className="block mb-1 font-bold">Cursus Assossié<span className="text-red-500">*</span> :</label>
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="flex w-full bg-gray-200 p-2 rounded-xl"
                required>
                <option value="" disabled>Choisissez un curriculum</option>
                {selectedDepartment?.curriculums?.map(curriculum => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-red-500 text-sm">* champ(s) obligatoire(s)</p>
            {error && <p className="text-red-500">{error}</p>}

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

export default FormationLevelAddingForm;
