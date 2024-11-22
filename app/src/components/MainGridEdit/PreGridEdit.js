import React, { useState } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";
import { curriculums } from "../../constants";

const PreGridEdit = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState({});
  const navigate = useNavigate();

  const goToPreviEdit = () => {
    navigate("/PreviEdit", { state: { selectedCurriculum } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />

      <div className="flex flex-col items-center justify-center flex-1 space-y-10 py-10">
        <div className="flex space-x-8">

          {/* Champ de selection du Cursus */}
          <div className="w-64">
            <label className="pl-4 translate-y-12 z-10 block mb-2 text-xl text-white">Cursus :</label>
            <select
              value={selectedCurriculum.name}
              onChange={(e) => {
                  const selectedType = curriculums.find((type) => type.name === e.target.value);
                  setSelectedCurriculum(selectedType);
              }}
              className="w-full min-w-48 h-28 p-3 text-2xl
                default-select focus:outline-none">
              <option value="" disabled>
              Choisir un Cursus
              </option>
              {curriculums.map((type) => (
                  <option key={type.name} value={type.name}>
                      {type.name}
                  </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="w-1/5 min-w-40 px-6 py-3 text-white text-xl 
            bg-primary rounded-full shadow-md hover:bg-primaryshade focus:bg-primarytint 
            focus:outline-none border border-white"
          onClick={goToPreviEdit}>
          Confirmer
        </button>
      </div>
    </div>
  );
};

export default PreGridEdit;
