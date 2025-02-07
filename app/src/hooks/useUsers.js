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

  const addUser = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.users.add(), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const newUser = await response.json().user;
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de l'ajout du utilisateur",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Utilisateur ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchUsers();
    }
  };

  const updateUser = async (payload) => {
    try {
      setIsSaving(true);
      const response = await fetch(routes.dev.users.update(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updatedUser = await response.json().user;
      setUsers((prev) =>
        prev.map((user) => user.id === updatedUser.id ? updatedUser : user)
      );
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la modification du utilisateur",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Utilisateur modifié avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchUsers();
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.users.delete(userId), { 
        method: "DELETE"
      });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
      setToast({
        message: error.message || "Erreur lors de la suppréssion de l'utilisateur",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Utilisateur supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, isSaving, error, fetchUsers, addUser, updateUser, deleteUser};
};

export default useUsers;
