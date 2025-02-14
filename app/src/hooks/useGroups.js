import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useGroups = (department = null, setToast) => {
  const [formationLevels, setFormationLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFormationLevels = async () => {
    try {
      setIsLoading(true);
      console.log(`Chargement des promotions...`);
      if (!department) throw new Error("Aucun department");
      const response = await fetch(routes.dev.groups.getFormationLevels(department.id));
      if (!response.ok) throw new Error("Erreur lors du chargement des promotions");

      const data = await response.json();
      setFormationLevels(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      console.log(`Chargement des promotions réussi`);
    }
  };

  useEffect(() => {
    if (department) {
      fetchFormationLevels();
    }
  }, [department]);
  
  const addFormationLevel = async (payload) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.addFormationLevel(payload.departmentId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          curriculumId: payload.curriculumId,
        }),
      });
    } catch (error) {
      setToast({ message: "Erreur de connexion", type: "error", visible: true });
    } finally {
      setToast({ message: "Promotion ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  const deleteFormationLevel = async (formationId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.deleteFormationLevel(formationId), { 
        method: "DELETE"
      });
    } catch (err) {
      setToast({
        message: "Erreur lors de la suppréssion de la promotion", type: "error", visible: true,
      });
    } finally {
      setToast({ message: "Promotion supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  const addGroup = async (payload) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.addGroup(payload.formationLevelID), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
        }),
      });
    } catch (error) {
      setToast({ message: "Erreur lors de l'ajout du groupe", type: "error", visible: true });
    } finally {
      setToast({ message: "Groupe ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.deleteGroup(groupId), { 
        method: "DELETE"
      });
    } catch (err) {
      setToast({
        message: "Erreur lors de la suppréssion du groupe", type: "error", visible: true,
      });
    } finally {
      setToast({ message: "Groupe supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  const addSubgroup = async (payload) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.addSubGroup(payload.groupID), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
        }),
      });
    } catch (error) {
      setToast({ message: "Erreur lors de l'ajout du sous-groupe", type: "error", visible: true });
    } finally {
      setToast({ message: "Sous-groupe ajouté avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  const deleteSubgroup = async (subgroupId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.deleteSubGroup(subgroupId), { 
        method: "DELETE"
      });
    } catch (err) {
      setToast({
        message: "Erreur lors de la suppréssion du sous-groupe", type: "error", visible: true,
      });
    } finally {
      setToast({ message: "Sous-groupe supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  return { formationLevels, isLoading, isSaving,
    addGroup, addFormationLevel, deleteFormationLevel, deleteGroup, addSubgroup, deleteSubgroup,
    getGroupList };
};

export default useGroups;
