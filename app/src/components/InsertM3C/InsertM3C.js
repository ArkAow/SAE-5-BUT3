import React, { useState } from "react";
import Header from "../header/header";
import routes from "../../Routes/routes";

const InsertM3C = () => {
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedExtensions = ["csv", "xlsx"];

    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        setError("");
        setFile(uploadedFile);
      } else {
        setError("Veuillez sélectionner un fichier .csv ou .xlsx.");
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier valide avant de soumettre.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(routes.insertM3C.dev, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du fichier.");
      }

      const data = await response.json();
      if (data.success) {
        setFileContent(data.data);
        setError("");
      } else {
        setError(data.error || "Erreur lors de la lecture du fichier.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier :", error);
      setError("Erreur lors de l'envoi du fichier.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cover bg-center bg-landscape flex flex-col pt-10">
        <div className="flex flex-col items-center w-1/2 justify-center max-w-[60%] mx-auto mt-8 bg-[rgba(0,0,0,0.7)] rounded-2xl shadow-lg p-8">
          <h1 className="text-white text-2xl mb-4">Insérez votre fichier M3C</h1>
          
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="mb-2 text-gray-500"
          />
          
          {error && <p className="text-red-500 mb-2">{error}</p>}
          
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Envoyer le fichier
          </button>

          {/* Afficher le contenu du fichier */}
          {fileContent && (
            <div className="mt-6 bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-bold mb-2">Contenu du fichier :</h2>
              <table className="table-auto w-full">
                <tbody>
                  {fileContent.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border px-2 py-1">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InsertM3C;
