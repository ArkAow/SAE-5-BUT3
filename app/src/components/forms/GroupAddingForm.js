import React, { useState } from "react";

const GroupAddingForm = ({selectedFormationLevel, addGroup, setAddingGroup, isSaving}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setName("");
    setAddingGroup(false);
  }

  const handleAddingDepartment = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Le nom du groupe est obligatoire.");
      return;
    }

    const existingGroup = selectedFormationLevel.groups.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );

    if (existingGroup) {
      setError("Un groupe avec ce nom existe déjà dans cette formation.");
      return;
    }

    setError("");
    const payload = {
      name: name,
      formationLevelID: selectedFormationLevel.id,
    };
    await addGroup(payload);
    handleLeaving();
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Ajouter un groupe</h2>
          <form onSubmit={handleAddingDepartment} className="space-y-2">
            <div>
              <label className="block mb-1 font-bold">Nom du groupe<span className="text-red-500">*</span> :</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
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

export default GroupAddingForm;
