import React, { useState } from "react";
import Header from "../header/header.js";
import routes from "../../Routes/routes";
import Toast from "../Toast/Toast.js";

const InsertM3C = () => {
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedExtensions = ["csv", "xls", "xlsx"];
    const fileExtension = uploadedFile?.name.split(".").pop().toLowerCase();
    if (uploadedFile && allowedExtensions.includes(fileExtension)) {
      setFile(uploadedFile);
      setToast({ message: "", visible: false });
    } else {
      setFile(null);
      setToast({ message: "Veuillez sélectionner un fichier de type .csv, .xls ou .xlsx.", type: "error", visible: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setToast({ message: "Veuillez sélectionner un fichier valide avant de soumettre.", type: "error", visible: true });
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(routes.insertM3C.dev, { method: "POST", body: formData });
      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: data.message || "Fichier traité avec succès !", type: "success", visible: true });
      } else {
        throw new Error(data.error || "Erreur lors du traitement du fichier.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setToast({ message: "Erreur lors du processus.", type: "error", visible: true });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cover bg-center bg-landscape flex flex-col pt-10">
        <div className="flex flex-col items-center w-1/2 justify-center max-w-[60%] mx-auto mt-8 bg-[rgba(0,0,0,0.7)] rounded-2xl shadow-lg p-8">
          <h1 className="text-white text-2xl mb-4">Insérez votre fichier M3C</h1>
          <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileUpload} className="mb-2 text-gray-500" />
          <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Envoyer le fichier
          </button>
        </div>
        {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
      </div>
    </>
  );
};

export default InsertM3C;
