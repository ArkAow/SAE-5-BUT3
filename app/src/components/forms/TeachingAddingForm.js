import React, { useState } from "react";

const TeachingAddingForm = ({teacher, subjects, addSubjectForTeacher, setAddingTeaching, isSaving}) => {
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setAddingTeaching(false);
  }

  const handleAddingTeaching = async (subject) => {
    await addSubjectForTeacher(teacher.id, subject.id);
  };

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-center">Ajouter un enseignement</h2>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <div className="space-y-2 max-h-[500px] h-2/3 overflow-y-auto">
            {subjects.length > 0 ? (
              <ul className="space-y-4">
                {subjects.map((subject) => (
                  <li 
                    key={subject.id} 
                    className="w-full flex items-center rounded-lg p-2 bg-gray-200 hover:bg-gray-300 cursor-pointer transition"
                    onClick={() => handleAddingTeaching(subject)}>
                    <span className="truncate">{subject.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">Aucune matière disponible</p>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={handleLeaving} className="btn-default p-2" disabled={isSaving}>
              Retour
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingAddingForm;