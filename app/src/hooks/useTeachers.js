import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useTeachers = (setToast = () => {}, department = null) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachersFromDepartment = async () => {
    if (!department) {return;}
    setIsLoading(true);
    try {
      console.log(`Chargement des enseignants...`);
      const response = await fetch(routes.dev.teachers.getFromDepartment(department.id));
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

  const addTeacherForDepartment = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.teachers.addForDepartment(department.id), {
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
        message: error.message || "Erreur lors de l'ajout de l'enseignant",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignant ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
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
      const updatedTeacher = data.teacher;
      setTeachers((prev) =>
        prev.map((teacher) => teacher.id === updatedTeacher.id ? updatedTeacher : teacher)
      );
    } catch (err) {
      setError(err.message);
      setToast({
        message: err.message || "Erreur lors de la modification de l'enseignants",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignants modifié avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
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
      fetchTeachersFromDepartment();
    }
  };

  useEffect(() => {
    fetchTeachersFromDepartment();
  }, [department]);

  return { teachers, isLoading, isSaving, error, fetchTeachersFromDepartment, addTeacherForDepartment, updateTeacher, deleteTeacher};
};

export default useTeachers;
