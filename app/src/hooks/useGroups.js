import { useState, useEffect } from "react";

const useGroups = (curriculum) => {
  const [groups, setGroups] = useState([]);
  const [isGroupLoading, setIsGroupLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const classID = curriculum?.formationLevels?.[0]?.id;
      if (!classID) throw new Error("Aucun classID trouvé");

      const response = await fetch(routes.dev.groups.getGroups(classID));
      if (!response.ok) throw new Error("Erreur lors du chargement des groupes");

      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGroupLoading(false);
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

  return { groups, isGroupLoading, getGroupList };
};

export default useGroups;
