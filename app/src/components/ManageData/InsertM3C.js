import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";

const InsertM3C = () => {
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  const goToManageData = () => {
    navigate("/ManageData");
  }; 

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedExtensions = ["csv", "xls", "xlsx"];
    const fileExtension = uploadedFile?.name.split(".").pop().toLowerCase();

    if (uploadedFile && allowedExtensions.includes(fileExtension)) {
      setFile(uploadedFile);
      setToast({ message: "", visible: false });
    } else {
      setFile(null);
      setToast({
        message: "Veuillez sélectionner un fichier de type .csv, .xls ou .xlsx.",
        type: "error",
        visible: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setToast({
        message: "Veuillez sélectionner un fichier valide avant de soumettre.",
        type: "error",
        visible: true,
      });
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const uploadResponse = await fetch("http://localhost:8600/insertM3C", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || "Erreur lors de l'upload du fichier.");
      }
      const fileId = uploadData.fileId;
      const insertResponse = await fetch(`http://localhost:8600/insert-data/${fileId}`, {
        method: "POST",
      });
      const insertData = await insertResponse.json();
      if (!insertResponse.ok || !insertData.status) {
        throw new Error(insertData.error || "Erreur lors de l'insertion des données.");
      }
      setToast({
        message: insertData.message || "Données insérées avec succès !",
        type: "success",
        visible: true,
      });
    } catch (error) {
      setToast({
        message: "Une erreur est survenue.",
        type: "error",
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
      <div className="flex flex-row items-center mt-16 ml-10 py-1 px-8 
        text-white bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg">
        <span 
            onClick={goToHomePage} 
            className="cursor-pointer hover:underline">
            Page d'accueil /
        </span>
        <img src="/images/options.svg" alt="Options Icon" className="w-8 h-8"/>
        <span
          onClick={goToManageData} 
          className="cursor-pointer hover:underline">
            Gestion des données /
        </span>
        <span>
          Insérer le M3C
        </span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 space-y-5 py-10">
        <div className="flex flex-row w-[70vw] min-w-80 max-w-[55rem] items-start bg-black bg-opacity-75 p-10 rounded-lg justify-between space-x-10">
          <div className="flex flex-col items-start">
            <h1 className="text-white text-3xl font-bold mt-1">Insérez votre fichier M3C</h1>
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileUpload}
              className="my-4 text-gray-300"/>
            <button
              onClick={handleSubmit}
              className="btn-default p-2">
              Envoyer le fichier
            </button>
          </div>
  
          <div className={`flex flex-col items-center justify-center bg-black bg-opacity-75 p-6 rounded-lg 
            transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"}`}>
            <div className="spinner"></div>
            <div className="text-white text-3xl font-bold mt-4">
              Envoie des données...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertM3C;