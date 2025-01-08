export const determineCourseGroup = (course, groups, groupList) => {
    const { x } = course.pos;
    const groupName = groupList[x];
  
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
  