import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(routes.dev.departments.get());
      if (!response.ok) throw new Error("Erreur lors du chargement des départements");

      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout du département");
      }

      const newDepartment = await response.json();
      setDepartments((prev) => [...prev, newDepartment.department]);

    } catch (err) {
      setError(err.message);
    }
  };

  const updateDepartment = async (payload) => {
    await fetch(routes.dev.departments.update(), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };
  
  const deleteDepartment = async (departmentId) => {
    await fetch(routes.dev.departments.delete(departmentId), { 
      method: "DELETE"
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { departments, loading, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment};
};

export default useDepartments;
