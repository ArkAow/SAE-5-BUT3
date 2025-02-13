import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useGroups = (departmentId = null, setToast) => {
  const [formationLevels, setFormationLevels] = useState([]);
  const [isFormationLevelLoading, setIsFormationLevelLoading] = useState(true);

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
    const groups = [];
    
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  return { formationLevels, isFormationLevelLoading };
};

export default useGroups;
