import React, { useState, useEffect } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

// Hook pour récupérer les cursus
const useFetchCurriculums = (url) => {
  const [curriculums, setCurriculums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des curriculums");
        }
        const data = await response.json();
        setCurriculums(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, [url]);

  return { curriculums, error, loading };
};

const PreGridEdit = () => {
  const { curriculums, error, loading } = useFetchCurriculums("http://localhost:8600/curriculums");
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const navigate = useNavigate();

  const handleCurriculumChange = (e) => {
    const selected = curriculums.find(
      (curriculum) => curriculum.id === parseInt(e.target.value, 10)
    );
    setSelectedCurriculum(selected);
  };

  const goToPreviEdit = () => {
    if (selectedCurriculum) {
      navigate("/PreviEdit", { state: { selectedCurriculum } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />

      <div className="flex flex-col items-center justify-center flex-1 space-y-10 py-10">
        {error && (
          <div className="text-primary text-3xl font-bold px-10 py-3 bg-white rounded-full">
            Erreur lors du chargement des données
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center bg-black bg-opacity-75 p-10 rounded-lg">
            <div className="spinner"></div>
            <div className="text-white text-3xl font-bold mt-4">
              Chargement des cursus...
            </div>
          </div>
        ) : (
          <>
            {/* Sélecteur de cursus */}
            <div className={`${error ? 'hidden' : 'flex space-x-8'}`}>
              <div className="w-64">
                <label
                  htmlFor="curriculum-select"
                  className="pl-4 translate-y-12 z-10 block mb-2 text-xl text-white">
                  Cursus :
                </label>
                <select
                  id="curriculum-select"
                  value={selectedCurriculum?.id || ""}
                  onChange={handleCurriculumChange}
                  className="w-full min-w-48 h-28 p-3 text-2xl default-select focus:outline-none"
                  aria-label="Sélectionner un cursus">
                  <option value="" disabled>
                    {curriculums.length > 0
                      ? "Choisir un Cursus"
                      : "Aucun Cursus"}
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
                  !selectedCurriculum ? "bg-primaryshade cursor-not-allowed" : ""}
                ${error ? 'hidden' : ''}`}
              onClick={goToPreviEdit}
              disabled={!selectedCurriculum}
              aria-disabled={!selectedCurriculum}>
              Confirmer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreGridEdit;
