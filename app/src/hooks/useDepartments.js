import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useDepartments = (setToast) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      console.log(`Chargement des départements...`);
      const response = await fetch(routes.dev.departments.get());
      if (!response.ok) throw new Error("Erreur lors du chargement des départements");
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      console.log(`Chargement des départements réussi`);
    }
  };

  const addDepartment = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.departments.add(), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const newDepartment = data.department;
      setDepartments((prev) => [...prev, newDepartment]);
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de l'ajout du département",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Département ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchDepartments();
    }
  };

  const updateDepartment = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.departments.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const updatedDepartment = data.department;
      setDepartments((prev) =>
        prev.map((dept) => dept.id === updatedDepartment.id ? updatedDepartment : dept)
      );
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la modification du département",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Département modifié avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchDepartments();
    }
  };
  
  const deleteDepartment = async (departmentId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.departments.delete(departmentId), { 
        method: "DELETE"
      });
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la suppréssion du département",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Département supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchDepartments();
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { departments, isLoading, isSaving, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment};
};

export default useDepartments;
