import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useDepartments = (setToast) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const addDepartment = async (name, curriculums = []) => {
    try {
      const response = await fetch(routes.dev.departments.add(), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, curriculums }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'ajout du département");
      }

      const newDepartment = await response.json();
      setDepartments((prev) => [...prev, newDepartment.department]);

    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de l'ajout du département",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Département ajouté avec succès", type: "success", visible: true });
      fetchDepartments();
    }
  };

  const updateDepartment = async (payload) => {
    try {
      await fetch(routes.dev.departments.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la modification du département",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Département modifié avec succès", type: "success", visible: true });
      fetchDepartments();
    }
  };
  
  const deleteDepartment = async (departmentId) => {
    await fetch(routes.dev.departments.delete(departmentId), { 
      method: "DELETE"
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { departments, loading: isLoading, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment};
};

export default useDepartments;
