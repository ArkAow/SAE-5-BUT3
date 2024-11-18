import React from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

const PreGridEdit = () => {
  const navigate = useNavigate();

  const goToPreviEdit = () => {
    navigate("/PreviEdit");
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
                className="w-full min-w-48 h-28 p-3 text-white text-2xl font-bold 
                  bg-primary border hover:bg-primaryshade border-white rounded-lg shadow-sm focus:outline-none">
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3 Initial</option>
                <option value="A3-apprentice">A3 Alternant</option>
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
