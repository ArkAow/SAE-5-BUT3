export const createItemsFromData = (payload, itemID) => {
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
          id: itemID + week,
          color: selectedCourseType.color,
          courseType: selectedCourseType.name,
          teacher: selectedTeacher.code,
          duration: selectedDuration,
        };
        newItems.push({ positionKey, newItem });
      }
    } else {  
        const positionKey = `${selectedRow}-${selectedCol}`;
        const newItem = {
          id: itemID,
          color: selectedCourseType.color,
          courseType: selectedCourseType.name,
          teacher: selectedTeacher.code,
          duration: selectedDuration,
        };
        newItems.push({ positionKey, newItem });
    }
    return newItems;
}

export const createCoursesFromData = (payload, subject, itemID) => {
    const selectedTeacher = payload.teacher;
    const selectedCourseType = payload.courseType;
    const selectedDuration = payload.duration
    const selectedRow = payload.row;
    const selectedCol = payload.col;
    const selectedGroup = payload.group;
    const selectedSubject = subject;
    const courseId = payload.id || undefined;
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
          id: courseId,
          itemID: itemID + week,
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
        id: courseId,
        itemID: itemID,
        teacher: selectedTeacher,
        courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
        duration: selectedDuration,
        subject: selectedSubject,
        pos: { x: selectedCol, y: selectedRow },
        group: selectedGroup,
      };
      newCourses.push(newCourse);
    }
    return newCourses;
}