import { useState, useEffect } from "react";
import { createCoursesFromData, createItemsFromData, findCourseTypeByName, findTeacherByCode } from "../services/courseService.js";
import { getCoursePosFromGroup } from "../services/courseGroupService.js";

const useCourses = (selectedSubject, teachers, courseTypes, groups, groupList) => {
  const [items, setItems] = useState({});
  const [courses, setCourses] = useState([]);
  const [modifiedCourses, setModifiedCourses] = useState([]);
  const [deletedCourses, setDeletedCourses] = useState([]);

  // Charger les cours et transformer leur format pour `items`
  useEffect(() => {
    if (!selectedSubject) {
      setItems({});
      setCourses([]);
      return;
    }
    setCourses([]);
    const rawCourses = selectedSubject.courses;
    rawCourses.forEach((rawCourse) => {
      const { x, y } = getCoursePosFromGroup(rawCourse, groups, groupList);
      const newItemID = Date.now()+rawCourse.id;
      rawCourse.col = x;
      rawCourse.row = y;
      rawCourse.isRepeat = false;
      setCourses((prev) => [...prev, ...createCoursesFromData(rawCourse, selectedSubject, newItemID)]);
    });
    console.log(courses);

    const initialItems = {};
    if (!courses.length > 0) return;
    courses.forEach((course) => {
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

    setItems(initialItems);
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
    setItems((prev) => {
      const updatedItems = { ...prev };
      if (updatedItems[positionKey]) {
        updatedItems[positionKey] = updatedItems[positionKey].filter((item) => item.id !== id);
        if (updatedItems[positionKey].length === 0) delete updatedItems[positionKey];
      }
      return updatedItems;
    });

    setDeletedCourses((prev) => [
      ...prev,
      ...selectedSubject.courses.filter((course) => course.itemID === id && course.id),
    ]);

    setModifiedCourses((prev) => prev.filter((course) => course.itemID !== id));
  };

  // Modifier un item
  const modifItem = (payload) => {
    const { positionKey, id, teacher, courseType, duration } = payload;
    const selectedTeacher = findTeacherByCode(teacher, teachers);
    const selectedCourseType = findCourseTypeByName(courseType, courseTypes);

    setItems((prev) => {
      const updatedItems = { ...prev };
      if (updatedItems[positionKey]) {
        updatedItems[positionKey] = updatedItems[positionKey].map((item) =>
          item.id === id ? { ...item, teacher, courseType, duration, color: selectedCourseType.color } : item
        );
      }
      return updatedItems;
    });
    setModifiedCourses((prev) =>
      prev.map((course) =>
        course.itemID === id ? {
              ...course,
              teacher: selectedTeacher || course.teacher,
              courseType: selectedCourseType || course.courseType,
              duration: duration || course.duration,
            } : course)
    );
  };

  // Déplacer un item
  const moveItem = (fromKey, toKey, id) => {
    setItems((prev) => {
      const fromItems = [...(prev[fromKey] || [])];
      const toItems = [...(prev[toKey] || [])];
      const itemIndex = fromItems.findIndex((item) => item.id === id);

      if (itemIndex === -1) return prev;

      const [draggedItem] = fromItems.splice(itemIndex, 1);
      setModifiedCourses((prev) =>
        prev.map((course) =>
          course.itemID === id ? {
                ...course,
                pos: { x: parseInt(toKey.split("-")[1], 10), y: parseInt(toKey.split("-")[0], 10) },
              } : course)
      );

      return {
        ...prev,
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
    modifiedCourses,
    deletedCourses,
    addItem,
    deleteItem,
    modifItem,
    moveItem,
    updateCoursesForRemovedType,
    setDeletedCourses,
    setModifiedCourses
  };
};

export default useCourses;
