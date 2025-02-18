import { useState, useEffect } from "react";
import { createCoursesFromData, createItemsFromData, findCourseTypeByName, findTeacherByCode } from "../services/courseService.js";
import { getCoursePosFromGroup, determineCourseGroup, getGroupID } from "../services/courseGroupService.js";

const useCourses = (selectedSubject, teachers, courseTypes, groups, groupList) => {
  const [items, setItems] = useState({});
  const [courses, setCourses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [modifiedCourses, setModifiedCourses] = useState([]);
  const [deletedCourses, setDeletedCourses] = useState([]);

const setCoursesItems = async () => {
  if (!selectedSubject) {
    setItems({});
    return;
  }
  setIsLoading(true);
  const rawCourses = selectedSubject.courses;
  let newCourses = [];
  rawCourses.forEach((rawCourse) => {
    const { x, y } = getCoursePosFromGroup(rawCourse, groups, groupList);
    const newItemID = Date.now()+rawCourse.id;
    rawCourse.col = x;
    rawCourse.row = y;
    rawCourse.isRepeat = false;
    newCourses = [...newCourses, ...(createCoursesFromData(rawCourse, selectedSubject, newItemID))];
  });
  const initialItems = {};

  if (newCourses.length > 0) {
    newCourses.forEach((course) => {
      const row = course.pos.y;
      const col = course.pos.x;
      const positionKey = `${row}-${col}`;
      if (!initialItems[positionKey]) {
        initialItems[positionKey] = [];
      }
      initialItems[positionKey].push({
        color: course.courseType?.color || "#ffffff",
        courseType: course.courseType?.name || "N/A",
        teacher: course.teacher?.code || "N/A",
        duration: course.duration || 1.0,
        id: course.itemID || Date.now(),
      });
    });
  }
  setCourses(newCourses);
  setItems(initialItems);
  setIsLoading(false);
}

  useEffect(() => {
    setCoursesItems();
  }, [selectedSubject]);

  // Ajouter un item
  const addItem = (payload) => {
    const newItemID = Date.now();
    const newItems = createItemsFromData(payload, newItemID);
    const newCourses = createCoursesFromData(payload, selectedSubject, newItemID);

    setModifiedCourses((prev) => [...prev, ...newCourses]);

    setItems((prev) => {
      const updatedItems = { ...prev };
      newItems.forEach(({ positionKey, newItem }) => {
        updatedItems[positionKey] = [...(updatedItems[positionKey] || []), newItem];
      });
      return updatedItems;
    });
  };

  // Supprimer un item
  const deleteItem = (positionKey, id) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[positionKey]) {
        updatedItems[positionKey] = updatedItems[positionKey].filter((item) => item.id !== id);
        if (updatedItems[positionKey].length === 0) {
          delete updatedItems[positionKey];
        }
      }
      return updatedItems;
    });
    setDeletedCourses((prevDeletedCourses) => [
      ...prevDeletedCourses,
      ...courses.filter(
        (course) => course.itemID === id && course.id
      ),
    ]);
    setModifiedCourses((prevModifiedCourses) =>
      prevModifiedCourses.filter((course) => course.itemID !== id)
    );
  };

  // Modifier un item
  const modifItem = (payload) => {
    const { positionKey, id, teacher, courseType, duration } = payload;
    const selectedTeacher = findTeacherByCode(teacher, teachers);
    const selectedCourseType = findCourseTypeByName(courseType, courseTypes);
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[positionKey]) {
        updatedItems[positionKey] = updatedItems[positionKey].map((item) =>
          item.id === id ? { ...item, teacher, courseType, duration, color: selectedCourseType.color } : item
        );
      }
      return updatedItems;
    });
    setModifiedCourses((prevModifiedCourses) => [
      ...prevModifiedCourses.filter((course) => course.itemID !== payload.id),
      ...courses.filter(
        (course) => course.itemID === payload.id
      ).map((course) => ({
        ...course,
        teacher: selectedTeacher || course.teacher,
        courseType: selectedCourseType || course.courseType,
        duration: duration ? duration : course.duration,
      })),
    ]);
  }

  // Déplacer un item
  const moveItem = (fromKey, toKey, id) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      const itemIndex = fromItems.findIndex((item) => item.id === id);
      if (itemIndex === -1) return prevItems; // Si l'élément n'existe pas, ne rien faire
      const [draggedItem] = fromItems.splice(itemIndex, 1);
      courses.map((course) => {
        if (course.itemID === draggedItem.id) {
          const xPos = parseInt(toKey.split("-")[1], 10);
          const yPos = parseInt(toKey.split("-")[0], 10);
          const updatedCourse = {
            ...course,
            pos: { x: xPos, y: yPos },
            group: {
              groupType: determineCourseGroup(xPos, groups, groupList),
              groupID: getGroupID(xPos, groups, groupList),
            },
          }; 
          setModifiedCourses((prevModifiedCourses) => [
            ...prevModifiedCourses,
            updatedCourse,
          ]);
          return updatedCourse;
        }
        return course;
      });
      return {
        ...prevItems,
        [fromKey]: fromItems,
        [toKey]: [...toItems, draggedItem],
      };
    });
  };

  // Met à jour les cours en cas de suppression d'un type de cours
  const updateCoursesForRemovedType = (removedTypeName) => {
    setItems((prev) => {
      const updatedItems = { ...prev };
      for (const key in updatedItems) {
        updatedItems[key] = updatedItems[key].map((item) =>
          item.courseType === removedTypeName
            ? { ...item, courseType: { name: "N/A", color: "#FFFFFF" } }
            : item
        );
      }
      return updatedItems;
    });
    setModifiedCourses((prev) =>
      prev.map((course) =>
        course.courseType?.name === removedTypeName ? { ...course, courseType: { name: "N/A", color: "#FFFFFF" } } : course
      )
    );
  };

  return {
    items,
    isLoading,
    modifiedCourses,
    deletedCourses,
    addItem,
    deleteItem,
    modifItem,
    moveItem,
    updateCoursesForRemovedType,
    setDeletedCourses,
    setModifiedCourses,
    setIsLoading
  };
};

export default useCourses;
