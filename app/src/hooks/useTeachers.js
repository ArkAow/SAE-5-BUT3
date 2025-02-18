import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useTeachers = (setToast = () => {}, department = null) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachersFromDepartment = async () => {
    if (!department) {return;}

    try {
      setIsLoading(true);
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
      await fetch(routes.dev.teachers.addForDepartment(department.id), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
    } catch (err) {
      setError(err.message);
      setToast({
        message: "Erreur lors de l'ajout de l'enseignant",
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
      await fetch(routes.dev.teachers.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      setError(err.message);
      setToast({
        message: "Erreur lors de la modification de l'enseignants",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignants modifié avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
    }
  };
  
  const deleteTeacherForDepartment = async (teacherId, departmentId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.teachers.deleteForDepartment(teacherId, departmentId), { 
        method: "DELETE"
      });
    } catch (err) {
      setError(err.message);
      setToast({
        message: "Erreur lors de la suppréssion de l'enseignant",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignant supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
    }
  };

  const deleteSubjectForTeacher = async (teacherId, subjectId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.teachers.deleteSubject(teacherId, subjectId), { 
        method: "DELETE"
      });
    } catch (err) {
      setError(err.message);
      setToast({
        message: "Erreur lors de la suppréssion de l'enseignement",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignement supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
    }
  };

  const addSubjectForTeacher = async (teacherId, subjectId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.teachers.addSubject(teacherId, subjectId), { 
        method: "POST"
      });
    } catch (err) {
      setError(err.message);
      setToast({
        message: "Erreur lors de l'ajout de l'enseignement",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Enseignement ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchTeachersFromDepartment();
    }
  };

  useEffect(() => {
    fetchTeachersFromDepartment();
  }, [department]);

  return { teachers, isLoading, isSaving, error,
    fetchTeachersFromDepartment, addTeacherForDepartment, updateTeacher, deleteTeacherForDepartment,
    deleteSubjectForTeacher, addSubjectForTeacher};
};

export default useTeachers;
