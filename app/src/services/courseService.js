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

export const findCourseTypeByName = (name, courseTypes) => {
  const courseType = courseTypes.find((type) => type.name === name) || null;
  return courseType ? { ...courseType } : null;
};

export const findTeacherByCode = (code, teachers) => {
  const teacher = teachers.find((teacher) => teacher.code === code) || null;
  return teacher ? { ...teacher } : null;
};

export const getAverageHourPerStudent = (subject, groupList) => {
  if (!subject?.courses || subject.courses.length === 0) return 0;

  let groupHours = {};
  let groupCounts = {};

  groupList.forEach((group) => {
    groupHours[group.id] = 0;
    groupCounts[group.id] = group.subGroups?.length || 1;
  });

  subject.courses.forEach((course) => {
    const { duration, group } = course;
    if (!group) return;

    const { groupID, groupType } = group;
    let parentGroup = groupID;

    if (groupType === "half_group") {
      const parent = groupList.find((g) => g.subGroups?.some((sg) => sg.id === groupID));
      if (parent) parentGroup = parent.id;
    }

    if (groupType === "formation_level" || groupType === "group") {
      groupHours[parentGroup] += duration;
    } else if (groupType === "half_group") {
      groupHours[parentGroup] += duration;
    }
  });

  let totalWeightedHours = 0;
  let totalStudents = 0;

  Object.keys(groupHours).forEach((parentGroup) => {
    const hours = groupHours[parentGroup];
    const count = groupCounts[parentGroup];

    totalWeightedHours += hours / count;
    totalStudents++;
  });

  return totalStudents > 0 ? Math.ceil(totalWeightedHours / totalStudents) : 0;
};