import React, { useState } from "react";
import Header from "../header/header.js";
import Navigation from "./Navigation.js";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const InsertM3C = () => {
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [selectedSheet, setSelectedSheet] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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
      const uploadResponse = await fetch(routes.dev.insertM3C(), {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || "Erreur lors de l'upload du fichier.");
      }
      const fileId = uploadData.fileId;
      const insertResponse = await fetch(routes.dev.insertData(fileId), {
        method: "POST",
      });
      const insertData = await insertResponse.json();
      if (!insertResponse.ok || !insertData.status) {
        throw new Error(insertData.error || "Erreur lors de l'insertion des données.");
      }

      setData(insertData.sheets);
      console.log(insertData.sheets);
      setToast({
        message: "Données insérées avec succès !",
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
    <>
      <Header />
      <Navigation />

      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center w-full mt-40">
          <div className="w-full mx-10 h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex flex-col items-start">
              <h1 className="text-white text-lg font-bold mt-1">Insérez votre fichier M3C</h1>
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
  
            <div className={`flex flex-col h-full mt-4 items-center justify-center bg-black bg-opacity-75 p-6 rounded-lg 
              transition-opacity duration-300`}>
              { loading ? (
                <>
                  <div className="spinner"></div>
                  <div className="text-white text-3xl font-bold mt-4">
                    Envoie des données...
                  </div>                   
                </>
                  ) : data ? (
                    <div className="w-full text-white">
                      <h2 className="text-lg font-bold mb-2">Sélectionnez les données :</h2>

                      {/* Dropdown pour les feuilles */}
                      <label className="block">Feuille :</label>
                      <select
                        className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                        value={selectedSheet}
                        onChange={(e) => {
                          setSelectedSheet(e.target.value);
                          setSelectedCurriculum("");
                          setSelectedSemester("");
                        }}
                      >
                        <option value="">Sélectionnez une feuille</option>
                        {Object.keys(data).map((sheet) => (
                          <option key={sheet} value={sheet}>
                            {sheet}
                          </option>
                        ))}
                      </select>

                      {/* Dropdown pour les curriculums */}
                      {selectedSheet && (
                        <>
                          <label className="block">Cursus :</label>
                          <select
                            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                            value={selectedCurriculum}
                            onChange={(e) => {
                              setSelectedCurriculum(e.target.value);
                              setSelectedSemester("");
                            }}
                          >
                            <option value="">Sélectionnez un curriculum</option>
                            {Object.keys(data[selectedSheet] || {}).map((curriculum) => (
                              <option key={curriculum} value={curriculum}>
                                {curriculum}
                              </option>
                            ))}
                          </select>
                        </>
                      )}

                      {/* Dropdown pour les semestres */}
                      {selectedCurriculum && (
                        <>
                          <label className="block">Semestre :</label>
                          <select
                            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                          >
                            <option value="">Sélectionnez un semestre</option>
                            {Object.keys(data[selectedSheet][selectedCurriculum] || {}).map(
                              (semester) => (
                                <option key={semester} value={semester}>
                                  {semester}
                                </option>
                              )
                            )}
                          </select>
                        </>
                      )}

                      {/* Affichage des matières */}
                      {selectedSemester && (
                        <div className="mt-4">
                          <h3 className="text-md font-bold">Matières du {selectedSemester} :</h3>
                          <ul className="list-disc ml-6">
                            {data[selectedSheet][selectedCurriculum][selectedSemester].map(
                              (subject, index) => (
                                <li key={index}>{subject.intitule || "Matière inconnue"}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                <div className="text-white text-3xl font-bold mt-4">
                  Envoyez des données pour les voir apparaitre ici
                </div>  
              )}
            </div>
          </div>
        </div>
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </>
  );
};

export default InsertM3C;