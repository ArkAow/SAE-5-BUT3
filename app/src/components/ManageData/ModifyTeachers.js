import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const ModifyTeachers = () => {
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [teachers, setTeachers] = useState([]);

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

  const fetchTeachers = async () => {
    try {
      const response = await fetch(routes.dev.teachers.get());
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des enseignants");
      }
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
      setToast({
        message: "Une erreur est survenue lors du chargement des enseignants.",
        type: "error",
        visible: true,
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}/>
      )}
      <div
        className="flex flex-row items-center mt-16 ml-10 py-1 px-8 
        text-white bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg">
        <span
          onClick={goToHomePage}
          className="cursor-pointer hover:underline">
          Page d'accueil /
        </span>
        <img src="/images/options.svg" alt="Options Icon" className="w-8 h-8" />
        <span
          onClick={goToManageData}
          className="cursor-pointer hover:underline">
          Gestion des données /
        </span>
        <span>Modifier les enseignants</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-5 py-10">
        <div
          className="flex flex-row w-[70vw] min-w-80 max-w-[55rem] items-start bg-black bg-opacity-75 p-10 rounded-lg justify-between space-x-10">
          {/* Section pour uploader un fichier */}
          <div className="flex flex-col items-start">
            <h1 className="text-white text-3xl font-bold mt-1">
              Modifier les enseignants
            </h1>
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileUpload}
              className="my-4 text-gray-300"/>
            <button className="btn-default p-2">Envoyer le fichier</button>
          </div>

          {/* Section pour afficher les enseignants */}
          <div
            className="flex flex-col items-center justify-center bg-black bg-opacity-75 p-6 rounded-lg 
            transition-opacity duration-300">
            <div
              className="text-white text-l font-bold m-1 overflow-y-auto custom-scrollbar-dark min-w-44 w-60 max-h-[300px]">
              {/* Affichage des enseignants */}
              {teachers.length === 0 ? (
                <span>Il n'y a pas d'enseignants.</span>
              ) : (
                <ul className="space-y-4">
                  {teachers.map((teacher) => (
                    <li
                      key={teacher.id}
                      className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                      <div>
                        <p>
                          <span className="font-semibold">Nom :</span>{" "}
                          {teacher.lastName} {teacher.firstName}
                        </p>
                        <p>
                          <span className="font-semibold">Code :</span>{" "}
                          {teacher.code}
                        </p>
                        <p>
                          <span className="font-semibold">Matières :</span>{" "}
                          {teacher.subjectsTaught.join(", ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyTeachers;
