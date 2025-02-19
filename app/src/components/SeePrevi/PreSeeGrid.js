import React, { useState } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext.js";

const PreSeeGrid = () => {
  const { departments = [] } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] ?? null);

  const [formationLevels, setFormationLevels] = useState(selectedDepartment?.formationLevels ?? []);
  const [selectedFormationLevel, setSelectedFormationLevel] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const goToPreviSee = () => {
    if (selectedCurriculum && selectedDepartment && selectedFormationLevel.groups.length > 0) {
      const payload = { selectedDepartment, selectedCurriculum, selectedFormationLevel };
      navigate("/SeePrevi", { state: payload });
    }
  };

  const handleFormationLevelChange = (e) => {
    const selected = formationLevels.find(
      (formationLevel) => formationLevel.id === parseInt(e.target.value, 10)
    );
    setSelectedFormationLevel(selected);

    if (!selected?.groups || selected.groups.length === 0) {
      setError(true);
      setErrorMessage("Pas de groupes disponibles pour ce niveau de formation");
      return;
    } else {
      setError(false);
    }

    if (!selected?.curriculums || selected.curriculums.length === 0) {
      setError(true);
      setErrorMessage("Pas de cursus associé à ce niveau de formation");
      setSelectedCurriculum(null);
      return;
    } else {
      setError(false);
      setSelectedCurriculum(selected.curriculums[0]);
    }
  };

  const handleChangeDepartment = (e) => {
    const selectedDeptId = parseInt(e.target.value, 10);
    const selectedDept = departments.find(dept => dept.id === selectedDeptId) ?? null;

    setSelectedDepartment(selectedDept);
    setSelectedFormationLevel(null);
    setFormationLevels(selectedDept?.formationLevels ?? []);
    setSelectedCurriculum(null);
    setError(false);
    setErrorMessage("");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen items-center justify-center flex-1 space-y-10 py-10">
        <>
          <div className={`flex space-x-8`}>
            {/* Sélecteur de département */}
            <div className="w-80">
              <label className="pl-4 translate-y-12 z-10 block mb-2 text-xl text-white">
                Département :
              </label>
              {departments.length > 1 ? (
                <select
                  className="w-full min-w-48 h-28 p-3 text-2xl default-select focus:outline-none"
                  value={selectedDepartment?.id || ""}
                  onChange={handleChangeDepartment}>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full min-w-48 h-28 p-3 text-2xl text-white font-bold bg-primary border border-white shadow-sm flex items-center justify-left rounded-lg">
                  {selectedDepartment?.name ?? "Aucun département"}
                </div>
              )}
            </div>

            {/* Sélecteur de formationlevel */}
            <div className="w-80">
              <label
                htmlFor="curriculum-select"
                className="pl-4 translate-y-12 z-10 block mb-2 text-xl text-white">
                Niveau de formation :
              </label>
              <select
                id="curriculum-select"
                value={selectedFormationLevel?.id || ""}
                onChange={handleFormationLevelChange}
                className={`w-full min-w-48 h-28 p-3 default-select focus:outline-none ${selectedFormationLevel ? 'text-2xl' : 'text-lg'}`}
                aria-label="Sélectionner un cursus">
                <option value="" disabled>
                  {formationLevels.length > 0 ? "Choisir un niveau de formation" : "Aucun niveau de formation"}
                </option>
                {formationLevels.map((formationLevel) => (
                  <option key={formationLevel.id} value={formationLevel.id}>
                    {formationLevel.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`text-primary text-sm font-bold px-2 py-1 bg-white rounded-full h-6 flex items-center justify-center transition-opacity duration-300 
            ${error ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {errorMessage}
          </div>

          {/* Bouton confirmer */}
          <button
            type="button"
            className={`w-1/5 min-w-40 px-6 py-3 text-white text-xl 
              bg-primary rounded-full shadow-md hover:bg-primaryshade focus:bg-primarytint 
              focus:outline-none border border-white transition-all duration-300 disabled:bg-primaryshade
              ${error ? "bg-primaryshade cursor-not-allowed" : ""}`}
            onClick={goToPreviSee}
            disabled={!(selectedCurriculum && selectedDepartment && selectedFormationLevel.groups.length > 0)}
            aria-disabled={!(selectedCurriculum && selectedDepartment && selectedFormationLevel.groups.length > 0)}>
            Confirmer
          </button>
        </>
      </div>
    </>
  );
};

export default PreSeeGrid;
