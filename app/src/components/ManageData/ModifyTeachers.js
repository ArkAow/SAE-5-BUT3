import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const ModifyTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [constraint, setConstraint] = useState();
  const [isPartTime, setIsPartTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedConstraint, setEditedConstraint] = useState(0);
  const [editedIsPartTime, setEditedIsPartTime] = useState(false);

  const startEditingTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setEditedFirstName(teacher.firstName);
    setEditedLastName(teacher.lastName);
    setEditedConstraint(teacher.time_constraints || 0);
    setEditedIsPartTime(teacher.is_partimetutor || false);
  };

  const navigate = useNavigate();

  const goToHomePage = () => navigate("/homePage");
  const goToManageData = () => navigate("/ManageData");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(routes.dev.teachers.get());
      if (!response.ok) throw new Error("Erreur lors du chargement des enseignants");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacher) => {
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

  const handleEditTeacher = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(routes.dev.teachers.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTeacher.id,
          firstName: editedFirstName,
          lastName: editedLastName,
          time_constraints: editedConstraint,
          is_partimetutor: editedIsPartTime,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification.");
      }
  
      setToast({ message: "Professeur modifié avec succès.", type: "success", visible: true });
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, firstName: editedFirstName, lastName: editedLastName, time_constraints: editedConstraint, is_partimetutor: editedIsPartTime }
            : teacher
        )
      );
      setEditingTeacher(null);
    } catch (error) {
      console.error(error);
      setToast({ message: "Erreur lors de la modification de l'enseignant", type: "error", visible: true });
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setToast({ message: "Veuillez fournir un nom et un prénom.", type: "error", visible: true });
      return;
    }
    if (constraint>40 || constraint<1) {
      setToast({ message: "La contrainte horaire est invalide", type: "error", visible: true });
      return;
    }

    try {
      const response = await fetch(routes.dev.teachers.add(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          constraint: constraint,
          is_partimetutor: isPartTime,

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
      setConstraint(0);
      setIsPartTime(false)
    } catch (error) {
      console.error(error);
      setToast({ message: "Erreur lors de l'ajout de l'enseignant", type: "error", visible: true });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />
      )}
      {/* Navigation */}
      <div className="absolute flex flex-row items-center top-16 left-10 space-x-2">
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img 
              src="/images/home.svg"
              className="size-8"/>
        </div>
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToManageData}>
          <img 
              src="/images/options.svg"
              className="size-8"/>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-5 py-10">
        <div className="flex flex-row w-[70vw] min-w-80 max-w-[55rem] items-start bg-black bg-opacity-75 p-10 rounded-lg justify-around space-x-10">
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
            <input
              type="number"
              min="0"
              max="40"
              value={constraint}
              onChange={(e) => setConstraint(e.target.value)}
              placeholder="Nombre maximum d'heures / semaines"
              className="p-2 rounded"
            />
            <label className="flex justify-center items-center space-x-2 text-white w-full">
              <input
                type="checkbox"
                checked={isPartTime}
                onChange={(e) => setIsPartTime(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
              <span>Enseignant à temps partiel</span>
            </label>
            <button type="submit" className="btn-default p-2">Ajouter</button>
          </form>

          <div className="flex flex-col max-h-80 items-center justify-center bg-black bg-opacity-75 p-6 rounded-lg transition-opacity duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center bg-black bg-opacity-75 p-6 rounded-lg 
              transition-opacity duration-300 opacity-100 w-60">
                <div className="spinner"></div>
                <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des enseignants...</div>
              </div>
            ) : (
              <div className="text-white text-l font-bold m-1 overflow-y-auto custom-scrollbar-light min-w-44 w-60 max-h-[300px]">
                {teachers.length === 0 ? (
                  <span>Il n'y a pas d'enseignants.</span>
                ) : (
                  <ul className="space-y-4">
                    {teachers.map((teacher) => (
                      <li key={teacher.id} className="flex justify-between items-center bg-white rounded-lg p-2">
                        <span className="text-base text-black max-w-[70%]">{teacher.code}
                          <span className="font-normal text-sm"> ({teacher.firstName} {teacher.lastName.toUpperCase()})</span>
                        </span>
                        <div>
                          <button
                            onClick={() => startEditingTeacher(teacher)}
                            className="size-4 btn-default justify-items-center ml-1">
                            <img src="images/options.svg" alt="Modifier" className="size-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher)}
                            className="size-4 btn-default justify-items-center ml-1">
                            <img src="images/cross.svg" alt="Fermer" className="size-3" />
                          </button> 
                     
                        </div>

                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {editingTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="tooltip-centered">
            <h2 className="text-xl font-bold mb-4">Modifier l'enseignant</h2>
            <form onSubmit={handleEditTeacher} className="space-y-4">
              <input
                type="text"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                placeholder="Prénom"
                className="p-2 rounded w-full bg-gray-300"
              />
              <input
                type="text"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                placeholder="Nom"
                className="p-2 rounded w-full bg-gray-300"
              />
              <input
                type="number"
                min="0"
                max="40"
                value={editedConstraint}
                onChange={(e) => setEditedConstraint(e.target.value)}
                placeholder="Nombre maximum d'heures / semaines"
                className="p-2 rounded w-full bg-gray-300"
              />
              <label className="flex items-center ml-3 space-x-2">
                <input
                  type="checkbox"
                  checked={editedIsPartTime}
                  onChange={(e) => setEditedIsPartTime(e.target.checked)}
                />
                <span>Enseignant à temps partiel</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingTeacher(null)} className="btn-default p-2">
                  Annuler
                </button>
                <button type="submit" className="btn-default p-2">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyTeachers;
