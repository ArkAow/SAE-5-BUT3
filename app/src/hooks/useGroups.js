import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useGroups = (departmentId = null, setToast) => {
  const [formationLevels, setFormationLevels] = useState([]);
  const [isFormationLevelLoading, setIsFormationLevelLoading] = useState(true);

  const [groups, setGroups] = useState([]);
  const [isGroupLoading, setIsGroupLoading] = useState(true);

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

  const fetchGroups = async (formationLevelId) => {
    try {
      setIsGroupLoading(true);
      console.log(`Chargement des groupes...`);
      const response = await fetch(routes.dev.groups.getGroups(formationLevelId));
      if (!response.ok) throw new Error("Erreur lors du chargement des groupes");

      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGroupLoading(false);
      console.log(`Chargement des groupes réussi`);
    }
  };

  useEffect(() => {
    if (departmentId) {
      fetchFormationLevels();
    }
  }, [departmentId]);

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  // Ajouter des groupes
  const addGroups = async (newGroups, formationLevelID) => {
    const filteredNewGroups = newGroups.filter(
      (newGroup) => !groups.some((g) => g.name === newGroup.name)
    );
    if (filteredNewGroups.length === 0) return;

    setGroups((prevGroups) => [...prevGroups, ...filteredNewGroups]);

    for (const group of filteredNewGroups) {
      try {
        const response = await fetch(routes.dev.groups.addGroups(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: group.name,
            halfgroups: group.subGroups || [],
            formationLevelID: formationLevelID,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setToast({
            message: error.message || "Erreur lors de l'ajout du groupe",
            type: "error",
            visible: true,
          });
          continue;
        }

        setToast({ message: "Groupe ajouté avec succès", type: "success", visible: true });
      } catch (error) {
        console.error("Erreur API:", error);
        setToast({ message: "Erreur de connexion", type: "error", visible: true });
      } finally {
        fetchGroups();
      }
    }
  };

  // Supprimer un groupe
  const deleteGroups = async (index) => {
    const group = groups[index];
    try {
      const response = await fetch(routes.dev.groups.deleteGroup(group.id), { method: "DELETE" });

      if (response.ok) {
        setGroups(groups.filter((_, i) => i !== index));
        setToast({ message: "Groupe supprimé", type: "success", visible: true });
      } else {
        setToast({ message: "Erreur suppression groupe", type: "error", visible: true });
      }
    } catch (error) {
      console.error("Erreur suppression groupe:", error);
      setToast({ message: "Erreur de connexion", type: "error", visible: true });
    } finally {
      fetchGroups();
    }
  };

  // Supprimer un sous-groupe
  const deleteHalfGroups = async (groupIndex, index) => {
    const group = groups[groupIndex];
    const halfGroup = group.subGroups[index];

    try {
      const response = await fetch(routes.dev.groups.deleteSubGroup(halfGroup.id), { method: "DELETE" });

      if (response.ok) {
        setGroups((prevGroups) =>
          prevGroups.map((g, i) =>
            i === groupIndex ? { ...g, subGroups: g.subGroups.filter((_, subIndex) => subIndex !== index) } : g
          )
        );
        setToast({ message: "Sous-groupe supprimé", type: "success", visible: true });
      } else {
        setToast({ message: "Erreur suppression sous-groupe", type: "error", visible: true });
      }
    } catch (error) {
      console.error("Erreur suppression sous-groupe:", error);
      setToast({ message: "Erreur de connexion", type: "error", visible: true });
    } finally {
      fetchGroups();
    }
  };

  // Ajouter un sous-groupe
  const addSubGroups = async (groupId, newSubGroup, index) => {
    try {
      const response = await fetch(routes.dev.groups.addSubGroups(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubGroup.name, group_id: groupId }),
      });

      if (!response.ok) {
        const error = await response.json();
        setToast({ message: error.message || "Erreur ajout sous-groupe", type: "error", visible: true });
        return;
      }

      setGroups((prevGroups) => {
        const updatedGroups = [...prevGroups];
        const updatedGroup = { ...updatedGroups[index] };
        updatedGroup.subGroups = [...updatedGroup.subGroups, newSubGroup];
        updatedGroups[index] = updatedGroup;
        return updatedGroups;
      });

      setToast({ message: "Sous-groupe ajouté", type: "success", visible: true });
    } catch (error) {
      console.error("Erreur ajout sous-groupe:", error);
      setToast({ message: "Erreur de connexion", type: "error", visible: true });
    } finally {
      fetchGroups();
    }
  };

  return { groups, isGroupLoading, formationLevels, isFormationLevelLoading, getGroupList, addGroups,
    deleteGroups, deleteHalfGroups, addSubGroups, fetchGroups };
};

export default useGroups;
