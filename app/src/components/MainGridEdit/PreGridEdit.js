import React, { useState, useEffect } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

const PreGridEdit = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await fetch("http://localhost:8600/curriculums");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des curriculums");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setCurriculums(data);
          setSelectedCurriculum(data[0]);
        } else {
          setCurriculums([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cursus :", error);
        alert("Impossible de charger les cursus.");
      }
    };

    fetchCurriculums();
  }, []);

  const goToPreviEdit = () => {
    if (!selectedCurriculum) {
      alert("Veuillez sélectionner un cursus valide.");
      return;
    }
    navigate("/PreviEdit", { state: { selectedCurriculum } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />

      <div className="flex flex-col items-center justify-center flex-1 space-y-10 py-10">
        {/* Sélecteur de cursus */}
        <div className="flex space-x-8">
          <div className="w-64">
            <label className="pl-4 translate-y-12 z-10 block mb-2 text-xl text-white">
              Cursus :
            </label>
            <select
              value={selectedCurriculum?.id || ""}
              onChange={(e) => {
                const selected = curriculums.find(
                  (curriculum) => curriculum.id === parseInt(e.target.value)
                );
                setSelectedCurriculum(selected);
              }}
              className="w-full min-w-48 h-28 p-3 text-2xl default-select focus:outline-none"
            >
              <option value="" disabled>
                {curriculums.length > 0
                  ? "Choisir un Cursus"
                  : "Aucun cursus disponible"}
              </option>
              {curriculums.map((curriculum) => (
                <option key={curriculum.id} value={curriculum.id}>
                  {curriculum.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton pour confirmer le choix */}
        <button
          type="button"
          className={`w-1/5 min-w-40 px-6 py-3 text-white text-xl 
            bg-primary rounded-full shadow-md hover:bg-primaryshade focus:bg-primarytint 
            focus:outline-none border border-white ${
              !selectedCurriculum ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={goToPreviEdit}
          disabled={!selectedCurriculum}
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};

export default PreGridEdit;