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

  const [expanded, setExpanded] = useState({});

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

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header />
      <Navigation />

      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center w-full mt-40">
          <div className="w-full mx-10 h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-white text-lg font-bold mt-1">Insérez votre fichier M3C</h1>
              <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileUpload}
                className="my-4 text-gray-300"/>
              <button onClick={handleSubmit} className="btn-default p-2">
                Envoyer le fichier
              </button>
            </div>

            <div
              className={`flex flex-col h-full mt-4 items-center bg-black bg-opacity-75 p-6 rounded-lg 
              transition-opacity duration-300 overflow-y-auto ${!loading || !data ? 'justify-center' : 'justify-start'}`}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <div className="text-white text-3xl font-bold mt-4">Envoie des données...</div>
                </>
              ) : data ? (
                <div className="w-full h-full text-white justify-start">
                  <h2 className="text-lg font-bold mb-2">Données disponibles :</h2>
                  
                  {Object.entries(data).map(([key, value]) => {
                    const curriculumName = Object.keys(value)[0] || key;

                    return (
                      <div key={key} className="mb-4">
                        {/* Cursus */}
                        <button
                          onClick={() => toggleExpand(key)}
                          className="w-full text-left bg-gray-700 px-4 py-2 rounded-md font-bold">
                          {curriculumName} {expanded[key] ? "▲" : "▼"}
                        </button>

                        {expanded[key] &&
                          Object.entries(value[curriculumName] || {}).map(([semester, subjects]) => (
                            <div key={semester} className="ml-6 mt-2">
                              {/* Semestre */}
                              <button
                                onClick={() => toggleExpand(`${key}-${semester}`)}
                                className="w-full text-left bg-gray-600 px-4 py-2 rounded-md">
                                {semester} {expanded[`${key}-${semester}`] ? "▲" : "▼"}
                              </button>

                              {expanded[`${key}-${semester}`] && (
                                <ul className="list-disc ml-8 mt-2">
                                  {/* Matières */}
                                  {subjects.map((subject, index) => (
                                    <li key={index} className="text-gray-300">
                                      {subject.intitule || "Matière inconnue"}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-white text-3xl font-bold mt-4">
                  Envoyez des données pour les voir apparaître ici
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
