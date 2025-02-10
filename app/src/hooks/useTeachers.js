import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useTeachers = (setToast) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      console.log(`Chargement des enseignants...`);
      const response = await fetch(routes.dev.teachers.get());
      if (!response.ok) throw new Error("Erreur lors du chargement des enseignants");
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      console.log(`Chargement des enseignants réussi`);
    }
  };

  const addTeacher = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.teachers.add(), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const newDepartment = data.department;
      setTeachers((prev) => [...prev, newDepartment]);
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de l'ajout de l'enseignants",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignants ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachers();
    }
  };

  const updateTeacher = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.teachers.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const updatedDepartment = data.department;
      setTeachers((prev) =>
        prev.map((dept) => dept.id === updatedDepartment.id ? updatedDepartment : dept)
      );
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la modification de l'enseignants",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignants modifié avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachers();
    }
  };
  
  const deleteTeacher = async (teacherId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.teachers.delete(teacherId), { 
        method: "DELETE"
      });
      setTeachers((prev) => prev.filter((dept) => dept.id !== teacherId));
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la suppréssion de l'enseignants",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignants supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachers();
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { teachers, isLoading, isSaving, error, fetchTeachers, addTeacher, updateTeacher, deleteTeacher};
};

export default useTeachers;
