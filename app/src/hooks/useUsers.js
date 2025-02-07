import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useUsers = (setToast) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log(`Chargement des utilisateurs...`);
      const response = await fetch(routes.dev.users.getAll());
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      console.log(`Chargement des utilisateurs réussi`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, isSaving, error, fetchUsers};
};

export default useUsers;
