import React, { useState } from "react";

const SubgroupAddingForm = ({selectedGroup, addSubgroup, setAddingSubgroup, isSaving}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setName("");
    setAddingSubgroup(false);
  }

  const handleAddingDepartment = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Le nom du sous-groupe est obligatoire.");
      return;
    }

    const existingSubgroup = selectedGroup.subGroups.find(
      (sg) => sg.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSubgroup) {
      setError("Un sous-groupe avec ce nom existe déjà dans cette formation.");
      return;
    }

    setError("");
    const payload = {
      name: name,
      groupID: selectedGroup.id,
    };
    await addSubgroup(payload);
    handleLeaving();
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Ajouter un sous-groupe</h2>
          <form onSubmit={handleAddingDepartment} className="space-y-2">
            <div>
              <label className="block mb-1 font-bold">Nom du sous-groupe<span className="text-red-500">*</span> :</label>
              <input
                type="text"
                value={name}
                placeholder={`${selectedGroup.name}A`}
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

export default SubgroupAddingForm;
