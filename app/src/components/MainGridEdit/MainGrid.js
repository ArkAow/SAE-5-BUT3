import React, { useEffect, useState } from "react";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";
import useTeachers from "../../hooks/useTeachers.js";
import { createPortal } from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createCoursesFromData, createItemsFromData, findCourseTypeByName, findTeacherByCode } from "../../services/courseService.js";
import { getCoursePosFromGroup, determineCourseGroup, getGroupID } from "../../services/courseGroupService.js";

const MainGrid = ({ department, curriculum, groups }) => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [isControlPanelExpanded, setIsControlPanelIsExpanded] = useState(true);

  const { teachers } = useTeachers(setToast, department);

  const [items, setItems] = useState({});
  const [modifiedCourses, setModifiedCourses] = useState([])
  const [deletedCourses, setDeletedCourses] = useState([])
  const [selectedSemester, setSelectedSemester] = useState();
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [courseTypes, setCourseTypes] = useState([]);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  const [isTryingToChangeSemester, setIsTryingToChangeSemester] = useState(false);
  const [pendingSemesterId, setPendingSemesterId] = useState(null);

  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSemesterLoading, setIsSemesterLoading] = useState(true);
  const [isSubjectLoading, setIsSubjectLoading] = useState(true);
  const [isCourseTypeLoading, setIsCourseTypeLoading] = useState(true);
  const [isCourseLoading, setIsCourseLoading] = useState(true);
  
  const NodePortal = ({ children }) => {
      return createPortal(children, document.getElementById("portal-root"));
  };

  useEffect(() => {
    if (!isSemesterLoading && !isSubjectLoading && !isCourseTypeLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isSemesterLoading, isSubjectLoading, isCourseTypeLoading]);


  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };


  /* Gestion des SEMESTRES et MATIERES -------------------------------------------- */
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        console.log(`Chargement des semestres...`);
        const response = await fetch(routes.dev.semesters.get(curriculum.id));
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des semestres.");
        }
        const semesters = await response.json();
        setAvailableSemesters(semesters);
        const firstSemester = semesters[0] || null;

        if (semesters[0]) {
          await fetchSubjects(firstSemester.id);
          setSelectedSemester(firstSemester);
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsSemesterLoading(false);
        console.log(`Chargement des semestres réussi`);
      }
    };

    fetchSemesters();
  }, [curriculum.id]);

  const fetchSubjects = async (semesterId) => {
    try {
      console.log(`Chargement des matières...`);
      const response = await fetch(routes.dev.subjects.getFromSemester(semesterId));
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des matières.");
      }
      const subjects = await response.json();
      setAvailableSubjects(subjects);
      setSelectedSubject(subjects[0] || null);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsSubjectLoading(false);
      console.log(`Chargement des matières réussi`);
    }
  };

  const handleTryingToChangeSemester = (e) => {
    const semesterId = parseInt(e.target.value, 10);
    if (modifiedCourses.length > 0 || deletedCourses.length > 0) {
      setPendingSemesterId(semesterId);
      setIsTryingToChangeSemester(true);      
    } else {
      handleSemesterChange(semesterId);
    }
  };
  
  const confirmSemesterChange = async () => {
    if (pendingSemesterId !== null) {
      await handleSemesterChange(pendingSemesterId);
      setPendingSemesterId(null);
    }
    setIsTryingToChangeSemester(false);
  };
  
  const cancelSemesterChange = () => {
    setPendingSemesterId(null);
    setIsTryingToChangeSemester(false);
  };

  const handleSemesterChange = async (semesterId) => {
    const selected = availableSemesters.find((s) => s.id === semesterId);
    if (selected) {
      await fetchSubjects(selected.id);
      const currentIndex = availableSubjects.findIndex(
        (subject) => subject.id === selectedSubject?.id
      );
      setCurrentSubjectIndex(currentIndex >= 0 ? currentIndex : 0);
      setSelectedSemester(selected);
      setModifiedCourses([]);
      setDeletedCourses([]);
    } else {
      setCurrentSubjectIndex(0);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value, 10);
    const selected = availableSubjects.find((s) => s.id === subjectId);
    setSelectedSubject(selected);
  };

  useEffect(() => {
    const initialItems = {};
    const courses = selectedSubject.courses || [];
    courses.forEach((course) => {
      const row = course.pos.y;
      const col = course.pos.x;
      const positionKey = `${row}-${col}`;

      if (!initialItems[positionKey]) {
        initialItems[positionKey] = [];
      }

      initialItems[positionKey].push({
        color: course.courseType?.color || "#ffffff",
        courseType: course.courseType.name,
        teacher: course.teacher.code || "N/A",
        duration: course.duration || 1.0,
        id: course.itemID || Date.now(),
      });
    });

    setItems(initialItems);
  }, [selectedSubject]);

  /* Gestion des COURS -------------------------------------------- */
  const fetchCoursesForSubjects = async () => {
    if (!selectedSemester) return;

    try {
      console.log(`Chargement des cours...`);
      setIsCourseLoading(true);
      let allSubjects = [];
      for (const subject of availableSubjects) {
        const response = await fetch(routes.dev.courses.getBySubject(subject.id));
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des cours.");
        }
        const data = await response.json();
        let allCourses = [];
        data.forEach((course) => {
          const { x, y } = getCoursePosFromGroup(course, groups, groupList);
          const newItemID = Date.now()+course.id;
          course.col = x;
          course.row = y;
          course.isRepeat = false;
          allCourses.push(...createCoursesFromData(course, subject, newItemID));
        });
        const newSubject = subject;
        newSubject.courses = allCourses;
        allSubjects.push(newSubject);
      }
      setAvailableSubjects(allSubjects);
    } catch (error) {
      console.error("Erreur inattendue :", error);
    } finally {
      if (availableSubjects[0]) {
        setSelectedSubject(availableSubjects[0]);
      }
      setIsCourseLoading(false);
      console.log(`Chargement des cours réussi`);
    }
  };

  useEffect(() => {
    fetchCoursesForSubjects();
  }, [selectedSemester]);

  const fetchCourseTypes = async () => {
    try {
      const response = await fetch(routes.dev.courseTypes.get());
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des types de cours.");
      }
      const data = await response.json();
      setCourseTypes(data);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsCourseTypeLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  const addItem = (payload) => {
    const newItemID = Date.now();
    const newItems = createItemsFromData(payload, newItemID);
    const newCourses = createCoursesFromData(payload, selectedSubject, newItemID);
    setModifiedCourses((prevModifiedCourses) => [
      ...prevModifiedCourses,
      ...newCourses,
    ]);
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      newItems.forEach(({ positionKey, newItem }) => {
        updatedItems[positionKey] = [...(updatedItems[positionKey] || []), newItem];
      });
      return updatedItems;
    });
    setAvailableSubjects((prevSubjects) => {
      const updatedSubjects = prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = [...(subject.courses || []), ...newCourses];
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
      return updatedSubjects;
    });
  };

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
      ...availableSubjects[currentSubjectIndex].courses.filter(
        (course) => course.itemID === id && course.id
      ),
    ]);
    setModifiedCourses((prevModifiedCourses) =>
      prevModifiedCourses.filter((course) => course.itemID !== id)
    );
    setAvailableSubjects((prevSubjects) => {
      const updatedSubjects = prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = subject.courses.filter((course) => course.itemID !== id);
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
      return updatedSubjects;
    });
  };

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
    setAvailableSubjects((prevSubjects) => {
      return prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = subject.courses.map((course) =>
            course.itemID === payload.id ? { 
              ...course, 
              teacher: selectedTeacher || course.teacher,
              courseType: selectedCourseType || course.courseType,
              duration: duration || course.duration}
              : course
          );
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
    });
    setModifiedCourses((prevModifiedCourses) => [
      ...prevModifiedCourses.filter((course) => course.itemID !== payload.id),
      ...availableSubjects[currentSubjectIndex].courses.filter(
        (course) => course.itemID === payload.id
      ).map((course) => ({
        ...course,
        teacher: selectedTeacher || course.teacher,
        courseType: selectedCourseType || course.courseType,
        duration: duration ? duration : course.duration,
      })),
    ]);
  }
  
  const moveItem = (fromKey, toKey, id) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      const itemIndex = fromItems.findIndex((item) => item.id === id);
      if (itemIndex === -1) return prevItems; // Si l'élément n'existe pas, ne rien faire
      const [draggedItem] = fromItems.splice(itemIndex, 1);
      setAvailableSubjects((prevSubjects) => {
        return prevSubjects.map((subject, index) => {
          if (index === currentSubjectIndex) {
            const updatedCourses = subject.courses.map((course) => {
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
            return { ...subject, courses: updatedCourses };
          }
          return subject;
        });
      });  
      return {
        ...prevItems,
        [fromKey]: fromItems,
        [toKey]: [...toItems, draggedItem],
      };
    });
  };

  const updateCoursesForRemovedType = (removedTypeName) => {
    setAvailableSubjects((prevSubjects) =>
      (prevSubjects || []).map((subject) => ({
        ...subject,
        courses: (subject.courses || []).map((course) =>
          course.courseType?.name === removedTypeName ? {...course, courseType: { name: "N/A", color: "#FFFFFF" }}: course)}))
    );
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      for (const key in updatedItems) {
        updatedItems[key] = (updatedItems[key] || []).map((item) =>
          item.courseType === removedTypeName
            ? { ...item, courseType: { name: "N/A", color: "#FFFFFF" } }
            : item
        );
      }
      return updatedItems;
    });
  };  

  const groupList = getGroupList();

  return (
    <div className={`min-h-screen py-10 ${isSaving ? 'cursor-wait' : 'cursor-default'}`}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] space-y-10">
          <div className="flex flex-col items-center bg-black bg-opacity-75 p-10 rounded-lg">
            <div className="spinner"></div>
            <div className="text-white text-3xl font-bold mt-4">
              Chargement des données...
            </div>
          </div>
        </div>
      ) : (
        <>
          {isTryingToChangeSemester && (
            <>
              <NodePortal>
                <div className="fixed inset-0 flex items-center justify-center z-20 text-xs bg-black bg-opacity-50">
                  <div className="bg-white p-5 rounded shadow-xl w-80 border-2 border-gray-300">
                    <h3 className="text-lg font-bold mb-2 text-center">Avertissement !</h3>
                    <p className="mb-4 text-center">
                      Vous êtes sur le point de changer de semestre.<br/>Toute modification non enregistrée sera perdue.<br/><br/>Voulez-vous continuer ?
                    </p>
                    <div className="flex justify-center space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={cancelSemesterChange}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={confirmSemesterChange}
                        className="px-4 py-2 btn-default w-full">
                        Continuer
                      </button>
                    </div>
                  </div>
                </div>
              </NodePortal>
            </>
          )}
          {toast.visible && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, visible: false })}
            />
          )}
          <div className="flex items-center justify-start gap-5 h-20 px-10">
            <div className="absolute top-6">
              <ControlPanel
                isExpanded={isControlPanelExpanded}
                setIsExpanded={setIsControlPanelIsExpanded}
                curriculum={curriculum}
                selectedSemester={selectedSemester}
                setToast={setToast}
                teachers={teachers}

                groups={groups}
                groupList={groupList}

                courseTypes={courseTypes}
                setCourseTypes={setCourseTypes}
                updateCoursesForRemovedType={updateCoursesForRemovedType}
                addItem={addItem}
                modifiedCourses={modifiedCourses}
                setModifiedCourses={setModifiedCourses}
                deletedCourses={deletedCourses}
                setDeletedCourses={setDeletedCourses}
                isSaving={isSaving}
                setSaving={setSaving}
              />
            </div>

            {/* Choix du semestre selon le curriculum */}
            <select
              className="w-fit min-w-28 max-w-60 h-10 mt-2 ml-24 px-2 before:px-4 py-2 default-select rounded-full font-normal"
              value={selectedSemester?.id || ""}
              onChange={handleTryingToChangeSemester}>
              <option value="" disabled>
                Choisir un semestre
              </option>
              {availableSemesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>

            {/* Choix des matières selon le semestre */}
            <select
              className="w-fit min-w-28 max-w-60 h-10 mt-2 px-2 before:px-4 py-2 default-select rounded-full font-normal"
              value={selectedSubject?.id || ""}
              onChange={handleSubjectChange}>
              <option value="" disabled>
                Choisir une matière
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {/* Bouton suivant */}
            <button
              onClick={() => {
                const nextSubjectIndex =
                  availableSubjects.findIndex((s) => s.id === selectedSubject?.id) +
                  1;
                if (nextSubjectIndex < availableSubjects.length) {
                  const nextSubject = availableSubjects[nextSubjectIndex];
                  setSelectedSubject(nextSubject);
                }
              }}
              disabled={
                !selectedSubject ||
                availableSubjects.indexOf(selectedSubject) >=
                  availableSubjects.length - 1
              }
              className={`flex w-48 h-10 mt-2 items-center px-4 py-2 text-white bg-primary rounded-full
                shadow-md hover:bg-primaryshade focus:bg-primarytint border border-white focus:outline-none
                ${
                  !selectedSubject ||
                  availableSubjects.indexOf(selectedSubject) >=
                    availableSubjects.length - 1
                    ? "bg-primaryshade cursor-not-allowed"
                    : ""
                }`}>
              Passer au suivant
              <img
                src="/images/right-arrow.svg"
                alt="Right Arrow"
                className="ml-2 w-4 h-4"/>
            </button>
          </div>

          {isCourseLoading ? (
            <div className="flex items-center justify-center w-full mt-10">
              <div className="flex flex-col items-center bg-black bg-opacity-75 p-10 rounded-lg">
                <div className="spinner"></div>
                <div className="text-white text-3xl font-bold mt-4">
                  Chargement des cours...
                </div>
              </div>
            </div>
          ) : (
            <>
              {groups.length === 0 ? (
                <div className="flex items-center justify-center w-full">
                  <div className="w-1/2 text-center text-primary mt-16 text-lg font-bold p-2 bg-white rounded-full">
                    Il n'y a pas de groupes, veuillez en ajouter pour consulter le tableau.
                  </div>
                </div>
              ) : (
                <DndProvider backend={HTML5Backend}>
                  <div className={`${isControlPanelExpanded ? "ml-36 max-w-[85vw]" : "ml-10 max-w-[93vw]"}
                  mt-8 rounded-lg overflow-auto max-h-[71vh] min-h-[25rem] -z-10 transform duration-500`}>
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `40px repeat(${groupList.length}, minmax(5rem, 1fr))`,
                      }}>
                      <div className="w-10 h-6"></div>
                      {groupList.map((groupName, colIndex) => (
                        <div
                          key={`col-label-${colIndex}`}
                          className="w-full h-6 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                          {groupName}
                        </div>
                      ))}
                      {Array.from(
                        { length: selectedSemester.week_duration || 20 }, // La durée par défaut est 20 si week_duration est indéfini
                        (_, i) => (selectedSemester.week_start || 1) + i // La semaine de départ par défaut est 1 si week_start est indéfini
                      ).map((week, rowIndex) => (
                        <React.Fragment key={`row-${rowIndex}`}>
                          <div className="h-20 w-10 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                            S{week}
                          </div>
                          {groupList.map((_, colIndex) => {
                            const positionKey = `${rowIndex}-${colIndex}`;
                            const cellItems = items[positionKey] || [];
                            return (
                              <Node
                                key={positionKey}
                                positionKey={positionKey}
                                items={cellItems}
                                courseTypes={courseTypes}
                                teachers={teachers}
                                moveItem={moveItem}
                                deleteItem={deleteItem}
                                modifItem={modifItem}
                              />
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </DndProvider>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MainGrid;