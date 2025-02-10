import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const ManageTeachers = () => {
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
      if (!response.ok)
        throw new Error("Erreur lors du chargement des enseignants");
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
      setToast({
        message: "Professeur supprimé avec succès.",
        type: "success",
        visible: true,
      });
      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
    } catch (error) {
      console.error(error);
      setToast({
        message: "Erreur lors de la suppression de l'enseignant",
        type: "error",
        visible: true,
      });
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

      setToast({
        message: "Professeur modifié avec succès.",
        type: "success",
        visible: true,
      });
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? {
                ...teacher,
                firstName: editedFirstName,
                lastName: editedLastName,
                time_constraints: editedConstraint,
                is_partimetutor: editedIsPartTime,
              }
            : teacher
        )
      );
      setEditingTeacher(null);
    } catch (error) {
      console.error(error);
      setToast({
        message: "Erreur lors de la modification de l'enseignant",
        type: "error",
        visible: true,
      });
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setToast({
        message: "Veuillez fournir un nom et un prénom.",
        type: "error",
        visible: true,
      });
      return;
    }
    if (constraint > 40 || constraint < 1) {
      setToast({
        message: "La contrainte horaire est invalide",
        type: "error",
        visible: true,
      });
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
      setToast({
        message: "Professeur ajouté avec succès.",
        type: "success",
        visible: true,
      });
      setTeachers((prev) => [...prev, { ...result, firstName, lastName }]);
      setFirstName("");
      setLastName("");
      setConstraint(0);
      setIsPartTime(false);
    } catch (error) {
      console.error(error);
      setToast({
        message: "Erreur lors de l'ajout de l'enseignant",
        type: "error",
        visible: true,
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <>
      <Header />

      {/* Navigation */}
      <div className="absolute flex flex-row items-center top-16 left-10 space-x-4">
        <div 
          className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img src="/images/home.svg" className="w-8 h-8"/>
        </div>
        <div 
          className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
          onClick={goToManageData}>
          <img src="/images/options.svg" className="w-8 h-8"/>
        </div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center px-8">
        <div className="flex justify-around w-full mx-10 mt-40">
          
          {/* Liste des enseignants */}
          <div className="w-1/2 min-w-[300px] h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Enseignants
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Enseignemants des enseignants */}
          <div className="w-1/2 min-w-[300px] h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Enseignemants
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageTeachers;
