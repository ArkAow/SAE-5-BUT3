import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useGroups = (departmentId = null, setToast) => {
  const [formationLevels, setFormationLevels] = useState([]);
  const [isFormationLevelLoading, setIsFormationLevelLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFormationLevels = async () => {
    try {
      setIsFormationLevelLoading(true);
      console.log(`Chargement des promotions...`);
      if (!departmentId) throw new Error("Aucun departmentId");
      const response = await fetch(routes.dev.groups.getFormationLevels(departmentId));
      if (!response.ok) throw new Error("Erreur lors du chargement des promotions");

      const data = await response.json();
      setFormationLevels(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFormationLevelLoading(false);
      console.log(`Chargement des promotions réussi`);
    }
  };

  useEffect(() => {
    if (departmentId) {
      fetchFormationLevels();
    }
  }, [departmentId]);

  const getGroupList = () => {
    const groups = formationLevels.groups || [];

    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  const addGroup = async (newGroups, formationLevelID) => {
    const groups = formationLevels.groups || [];
    const filteredNewGroups = newGroups.filter(
      (newGroup) => !groups.some((g) => g.name === newGroup.name)
    );
    if (filteredNewGroups.length === 0) return;

    for (const group of filteredNewGroups) {
      try {
        setIsSaving(true);
        await fetch(routes.dev.groups.addGroup(formationLevelID), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: group.name,
            formationLevelID: formationLevelID,
          }),
        });
      } catch (error) {
        setToast({ message: "Erreur de connexion", type: "error", visible: true });
      } finally {
        setToast({ message: "Enseignement ajouté avec succès", type: "success", visible: true });
        setIsSaving(false);
        fetchFormationLevels();
      }
    }
  };

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

  const deleteFormationLevel = async (FormationId) => {
    try {
      setIsSaving(true);
      await fetch(routes.dev.groups.deleteFormationLevel(FormationId), { 
        method: "DELETE"
      });
    } catch (err) {
      setToast({
        message: "Erreur lors de la suppréssion de la promotion",
        type: "error",
        visible: true,
      });
    } finally {
      setToast({ message: "Promotion supprimé avec succès", type: "success", visible: true });
      setIsSaving(false);
      fetchFormationLevels();
    }
  };

  return { formationLevels, isFormationLevelLoading, isSaving,
    addGroup, addFormationLevel, deleteFormationLevel };
};

export default useGroups;
