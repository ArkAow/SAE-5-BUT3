export const createItemsFromData = (payload) => {
    const selectedTeacher = payload.teacher;
    const selectedCourseType = payload.courseType;
    const selectedDuration = payload.duration
    const selectedRow = payload.row;
    const selectedCol = payload.col;
    let newItems = [];

    if (!selectedTeacher || !selectedCourseType || !selectedDuration) {
      console.error("Les informations de base sont manquantes.");
      return;
    } 
  
    if (payload.isRepeat) {
      const exceptionsArray = payload.exceptions ? payload.exceptions.map((val) => parseInt(val.trim(), 10) - 1) : [];
      for (let week = payload.repeatFrom; week <= payload.repeatTo; week++) {
        if (exceptionsArray.includes(week)) continue;
  
        const positionKey = `${week}-${selectedCol}`;
        const newItem = {
          color: selectedCourseType.color,
          courseType: selectedCourseType.name,
          teacher: selectedTeacher.code,
          duration: selectedDuration,
          id: Date.now() + week,
        };
        newItems.push({ positionKey, newItem });
      }
    } else {  
        const positionKey = `${selectedRow}-${selectedCol}`;
        const newItem = {
          color: selectedCourseType.color,
          courseType: selectedCourseType.name,
          teacher: selectedTeacher.code,
          duration: selectedDuration,
          id: Date.now(),
        };
        newItems.push({ positionKey, newItem });
    }
    return newItems;
}

export const createCoursesFromData = (payload, subject) => {
    const selectedTeacher = payload.teacher;
    const selectedCourseType = payload.courseType;
    const selectedDuration = payload.duration
    const selectedRow = payload.row;
    const selectedCol = payload.col;
    const selectedGroup = payload.group;
    const selectedSubject = subject;
    let newCourses = [];

    if (!selectedTeacher || !selectedCourseType || !selectedDuration) {
      console.error("Les informations de base sont manquantes.");
      return;
    } 
  
    if (payload.isRepeat) {
      const exceptionsArray = payload.exceptions ? payload.exceptions.map((val) => parseInt(val.trim(), 10) - 1) : [];
      for (let week = payload.repeatFrom; week <= payload.repeatTo; week++) {
        if (exceptionsArray.includes(week)) continue;
  
        const newCourse = {
          itemID: Date.now(),
          teacher: selectedTeacher,
          courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
          duration: selectedDuration,
          subject: selectedSubject,
          pos: { x: selectedCol, y: week },
          group: selectedGroup,
        };
        newCourses.push(newCourse);
      }
    } else {  
      const newCourse = {
        itemID: Date.now(),
        teacher: selectedTeacher,
        courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
        duration: selectedDuration,
        subject: selectedSubject,
        pos: { x: selectedCol, y: selectedRow },
        groupInfo: selectedGroup,
      };
      newCourses.push(newCourse);
    }
    return newCourses;
}