import React from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

const PreGridEdit = () => {
  const navigate = useNavigate();

  const goToPreviEdit = () => {
    navigate("/PreviEdit");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex justify-center items-start bg-cover bg-center bg-landscape py-10">
        <div className="flex justify-center items-start bg-red-600">
          <select>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A3">A3 initial</option>
            <option value="A3-apprentice">A3 Alternant</option>
          </select>
        </div>
        <button
          type="button"
          className="btn-primary transition duration-300"
          onClick={goToPreviEdit}
        >
          Confirmer
        </button>
      </div>
    </>
  );
};

export default PreGridEdit;
