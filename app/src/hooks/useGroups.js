import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useGroups = (curriculum, setToast) => {
  const [groups, setGroups] = useState([]);
  const [isGroupLoading, setIsGroupLoading] = useState(true);

  const fetchGroups = async () => {
    try {
        console.log(`Chargement des groupes...`);
        const formation_levelID = curriculum?.formationLevels?.[0]?.id;
        if (!formation_levelID) throw new Error("Aucun formation_levelID trouvé");

        const response = await fetch(routes.dev.groups.getGroups(formation_levelID));
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
    if (curriculum) {
      fetchGroups();
    }
  }, [curriculum]);

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  // Ajouter des groupes
  const addGroups = async (newGroups) => {
    const actualformationLevelID = curriculum.formationLevels[0].id;
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
            formationLevelID: actualformationLevelID,
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

  return { groups, isGroupLoading, getGroupList, addGroups, deleteGroups, deleteHalfGroups, addSubGroups };
};

export default useGroups;
