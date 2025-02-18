import React, { useState } from "react";

const TeacherAddingForm = ({addTeacherForDepartment, setAddingTeacher, isSaving}) => {
  const [teacherFirstname, setTeacherFirstname] = useState("");
  const [teacherLastname, setTeacherLastname] = useState("");
  const [isPartTime, setIsPartTime] = useState(false);
  const [timeConstraint, setTimeConstraint] = useState(20);
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setTeacherFirstname("");
    setTeacherLastname("");
    setIsPartTime(false);
    setTimeConstraint(20);
    setAddingTeacher(false);
  }

  const handleAddingTeacher = async (e) => {
    e.preventDefault();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/; // Lettres, espaces et tirets autorisés
    if (!teacherFirstname.trim()) {
      setError("Le prénom est obligatoire.");
      return;
    }
    if (!nameRegex.test(teacherFirstname)) {
      setError("Le prénom ne doit contenir que des lettres.");
      return;
    }
    if (!teacherLastname.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    if (!nameRegex.test(teacherLastname)) {
      setError("Le nom ne doit contenir que des lettres.");
      return;
    }
    const constraintInt = parseInt(timeConstraint, 10);
    if (isNaN(constraintInt) || constraintInt < 0 || constraintInt > 40) {
      setError("La contrainte horaire doit être un entier entre 0 et 40.");
      return;
    }
    setError("");
    const payload = {
      firstName: teacherFirstname.trim(),
      lastName: teacherLastname.trim(),
      constraint: constraintInt,
      is_partimetutor: isPartTime,
    };

    await addTeacherForDepartment(payload);
    handleLeaving();
  };

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Ajouter un enseignant</h2>
          <form onSubmit={handleAddingTeacher} className="space-y-2">
            <div>
              <label className="block mb-1 font-bold">Nom de l'enseigant<span className="text-red-500">*</span> :</label>
              <input
                type="text"
                value={teacherLastname}
                onChange={(e) => setTeacherLastname(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
            </div>
            <div>
              <label className="block mb-1 font-bold">Prénom de l'enseigant<span className="text-red-500">*</span> :</label>
              <input
                type="text"
                value={teacherFirstname}
                onChange={(e) => setTeacherFirstname(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
            </div>
            <div>
              <label className="block font-bold">Contrainte horaire<span className="text-red-500">*</span> :</label>
              <input
                type="number"
                step={1}
                value={timeConstraint}
                min={0}
                max={40}
                onChange={(e) => setTimeConstraint(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
            </div>
            <p className="text-xs text-justify">
              <span className="text-xs underline">Contrainte horaire :</span> Ce nombre représente le nombre maximum d'heures de cours qu'un enseigant peut donner. Cela est utilisé principalement pour les avertissements
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPartTime}
                onChange={(e) => setIsPartTime(e.target.checked)}
                className="size-5"/>
              <label className="font-bold">Est vacataire ?</label>
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

export default TeacherAddingForm;