import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const ModifyTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();

  const goToHomePage = () => navigate("/homePage");
  const goToManageData = () => navigate("/ManageData");

  const fetchTeachers = async () => {
    try {
      const response = await fetch(routes.dev.teachers.get());
      if (!response.ok) throw new Error("Erreur lors du chargement des enseignants");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeacher = async (teacher) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ${teacher.firstName} ${teacher.lastName} ?`)) return;

    try {
      const response = await fetch(routes.dev.teachers.delete(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teacher.id }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression.");
      }
      setToast({ message: "Professeur supprimé avec succès.", type: "success", visible: true });
      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
    } catch (error) {
      console.error(error);
      setToast({ message: "Erreur lors de la suppression de l'enseignant", type: "error", visible: true });
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setToast({ message: "Veuillez fournir un nom et un prénom.", type: "error", visible: true });
      return;
    }
    try {
      const response = await fetch(routes.dev.teachers.add(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout.");
      }
      const result = await response.json();
      setToast({ message: "Professeur ajouté avec succès.", type: "success", visible: true });
      setTeachers((prev) => [...prev, { ...result, firstName, lastName}]);
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error(error);
      setToast({ message: "Erreur lors de l'ajout de l'enseignant", type: "error", visible: true });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
      <Header />
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />
      )}
      <div className="flex flex-row items-center mt-16 ml-10 py-1 px-8 text-white bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg">
        <span onClick={goToHomePage} className="cursor-pointer hover:underline">Page d'accueil /</span>
        <img src="/images/options.svg" alt="Options Icon" className="w-8 h-8" />
        <span onClick={goToManageData} className="cursor-pointer hover:underline">Gestion des données /</span>
        <span>Modifier les enseignants</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-5 py-10">
        <div className="flex flex-row w-[70vw] min-w-80 max-w-[55rem] items-start bg-black bg-opacity-75 p-10 rounded-lg justify-between space-x-10">
          <form onSubmit={handleAddTeacher} className="flex flex-col space-y-4">
            <h1 className="text-white text-3xl font-bold mt-1">Ajouter un enseignant</h1>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              className="p-2 rounded"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className="p-2 rounded"
            />
            <button type="submit" className="btn-default p-2">Ajouter</button>
          </form>

          <div className="flex flex-col items-center justify-center bg-gray-600 bg-opacity-75 p-6 rounded-lg transition-opacity duration-300">
            <div className="text-white text-l font-bold m-1 overflow-y-auto custom-scrollbar-light min-w-44 w-60 max-h-[300px]">
              {teachers.length === 0 ? (
                <span>Il n'y a pas d'enseignants.</span>
              ) : (
                <ul className="space-y-4">
                  {teachers.map((teacher) => (
                    <li key={teacher.id} className="flex justify-between items-center bg-white rounded-lg p-4">
                      <div>
                        <span className="text-sm text-black">{teacher.code}</span>
                        <button
                          onClick={() => handleDeleteTeacher(teacher)}
                          className="size-4 btn-default justify-items-center ml-2">
                          <img src="images/cross.svg" alt="cross" className="size-3" />
                        </button>
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
