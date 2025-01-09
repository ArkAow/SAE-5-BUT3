export const determineCourseGroup = (index, groups, groupList) => {
    const groupName = groupList[index];
  
    if (!groupName) return "unknown";
    if (groupName === 'Tous') {
      return "formation_level";
    }
  
    const group = groups.find((g) => g.name === groupName);
  
    if (!group) {
      const parentGroup = groups.find((g) => 
        g.subGroups && g.subGroups.some((subGroup) => subGroup.name === groupName)
      );
      if (parentGroup) {
        return "half_group";
      }
      return "unknown";
    }
  
    if (group.subGroups && group.subGroups.length >= 0) {
      return "group";
    }
    return "unknown"; 
  };
  
  export const getGroupID = (index, groups, groupList) => {
    const groupName = groupList[index];
    if (!groupName) return null;
    if (groupName == 'Tous') return 1;

    const group = groups.find((g) => g.name === groupName || 
        (g.subGroups && g.subGroups.some((sub) => sub.name === groupName)));

    if (group) {
        if (group.subGroups) {
            const subGroup = group.subGroups.find((sub) => sub.name === groupName);
            return subGroup ? subGroup.id : group.id;
        }
        return group.id;
    }
    return null; // Si aucun groupe correspondant n'est trouvé
  };