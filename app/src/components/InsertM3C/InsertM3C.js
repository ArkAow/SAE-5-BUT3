import React, { useState } from "react";
import Header from "../header/header";

const InsertM3C = () => {
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["csv", "xls", "xlsx"];

    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        setError("");
        console.log("Fichier accepté :", file);
      } else {
        setError("Veuillez sélectionner un fichier tableur.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cover bg-center bg-landscape flex flex-col pt-10">
        <div className="flex flex-col items-center w-1/2 justify-center max-w-[60%] mx-auto mt-8 bg-[rgba(0,0,0,0.7)] rounded-2xl shadow-lg p-8">
          <h1 className="text-white text-2xl mb-4">Insérez votre fichier MCCC</h1>
          
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="mb-2 text-gray-500"/>
          
          {error && <p className="text-red-500">{error}</p>}        
        </div>

      </div>
    </>
  );
};

export default InsertM3C;
