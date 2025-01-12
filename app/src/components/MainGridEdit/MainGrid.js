import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";
import Toast from "../Toast/Toast.js";
import routes from "../../Routes/routes.js";

const MainGrid = ({ curriculum }) => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [isControlPanelExpanded, setIsControlPanelIsExpanded] = useState(true);

  const [items, setItems] = useState({});
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [courseTypes, setCourseTypes] = useState([]);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const [isLoading, setLoading] = useState(true);
  const [isGroupLoading, setIsGroupLoading] = useState(true);
  const [isSemesterLoading, setIsSemesterLoading] = useState(true);
  const [isSubjectLoading, setIsSubjectLoading] = useState(true);
  const [isCourseTypeLoading, setIsCourseTypeLoading] = useState(true);
  
  
  useEffect(() => {
    if (!isGroupLoading && !isSemesterLoading && !isSubjectLoading && !isCourseTypeLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isGroupLoading, isSemesterLoading, isSubjectLoading, isCourseTypeLoading]);

  /* Gestion des SEMESTRES et MATIERES -------------------------------------------- */
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch(routes.dev.semesters.get(curriculum.id));
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des semestres.");
        }
        const semesters = await response.json();
        setAvailableSemesters(semesters);
        setSelectedSemester(semesters[0] || null);

        if (semesters[0]) {
          fetchSubjects(semesters[0].id);
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsSemesterLoading(false);
      }
    };

    fetchSemesters();
  }, [curriculum.id]);

  const fetchSubjects = async (semesterId) => {
    try {
      const response = await fetch(routes.dev.subjects.get(semesterId));
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des matières.");
      }
      const subjects = await response.json();
      setAvailableSubjects(subjects);
      setSelectedSubject(subjects[0] || null);
      setCurrentCourses(subjects[0]?.courses || []);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsSubjectLoading(false);
    }
  };

  const handleSemesterChange = (e) => {
    const semesterId = parseInt(e.target.value, 10);
    const selected = availableSemesters.find((s) => s.id === semesterId);
    setSelectedSemester(selected);

    if (selected) {
      fetchSubjects(selected.id);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value, 10);
    const selected = availableSubjects.find((s) => s.id === subjectId);
    setSelectedSubject(selected);
    setCurrentCourses(selected?.courses || []);
  };

  useEffect(() => {
    const initialItems = {};
    currentCourses.forEach((course, index) => {
      const row = course.pos.y;
      const col = course.pos.x;
      const positionKey = `${row}-${col}`;

      if (!initialItems[positionKey]) {
        initialItems[positionKey] = [];
      }

      initialItems[positionKey].push({
        color: course.courseType?.color || "#ffffff",
        courseType: course.courseType.name,
        teacher: course.teacher.name || "N/A",
        duration: course.duration || 1.0,
        id: course.id || Date.now() + index,
      });
    });

    setItems(initialItems);
  }, [currentCourses]);

  
  /* Gestion des COURS -------------------------------------------- */
  useEffect(() => {
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

    fetchCourseTypes();
  }, []);

  const addItem = (payload) => {
    const selectedTeacher = payload.teacher;
    const selectedCourseType = payload.courseType;
    const selectedDuration = payload.duration
    const selectedRow = payload.row;
    const selectedCol = payload.col

    if (!selectedTeacher || !selectedCourseType || !selectedDuration) {
      console.error("Les informations de base sont manquantes.");
      return;
    }
  
    const newItems = [];
    const newCourses = [];
  
    if (payload.isRepeat) {
      const exceptionsArray = payload.exceptions ? payload.exceptions.map((val) => parseInt(val.trim(), 10) - 1) : [];

      for (let week = payload.repeatFrom; week <= payload.repeatTo; week++) {
        if (exceptionsArray.includes(week)) continue;
        
        const positionKey = `${week}-${selectedCol}`;
        const newItem = {
          color: selectedCourseType.color,
          courseType: selectedCourseType.name,
          teacher: selectedTeacher,
          duration: selectedDuration,
          id: Date.now() + week,
        };
  
        newItems.push({ positionKey, newItem });
  
        const newCourse = {
          teacher: { name: selectedTeacher },
          courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
          duration: selectedDuration,
          pos: { x: selectedCol, y: week },
          id: newItem.id,
        };
  
        newCourses.push(newCourse);
      }
    } else {
      const positionKey = `${selectedRow}-${selectedCol}`;
      const newItem = {
        color: selectedCourseType.color,
        courseType: selectedCourseType.name,
        teacher: selectedTeacher,
        duration: selectedDuration,
        id: Date.now(),
      };
  
      newItems.push({ positionKey, newItem });
  
      const newCourse = {
        teacher: { name: selectedTeacher },
        courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
        duration: selectedDuration,
        pos: { x: selectedCol, y: selectedRow },
        id: newItem.id,
      };
  
      newCourses.push(newCourse);
    }
  
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
  
    setCurrentCourses((prevCourses) => [...prevCourses, ...newCourses]);
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
  
    setAvailableSubjects((prevSubjects) => {
      const updatedSubjects = prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = subject.courses.filter((course) => course.id !== id);
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
  
      return updatedSubjects;
    });
  
    setCurrentCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
  };

  const modifItem = (updatedData) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const { positionKey, id, teacher, courseType, duration } = updatedData;
      if (updatedItems[positionKey]) {
        updatedItems[positionKey] = updatedItems[positionKey].map((item) =>
          item.id === id ? { ...item, teacher, courseType, duration } : item
        );
      }
      return updatedItems;
    });
    setAvailableSubjects((prevSubjects) => {
      return prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = subject.courses.map((course) =>
            course.id === updatedData.id
              ? { ...course, teacher: updatedData.teacher, courseType: updatedData.courseType, duration: updatedData.duration }
              : course
          );
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
    });
    setCurrentCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedData.id
          ? { ...course, teacher: updatedData.teacher, courseType: updatedData.courseType, duration: updatedData.duration }
          : course
      )
    );
    setIsEditing(false); // Ferme la modale
  };
  
  const moveItem = (fromKey, toKey, id) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      const itemIndex = fromItems.findIndex((item) => item.id === id);
      if (itemIndex === -1) return prevItems;
      const [draggedItem] = fromItems.splice(itemIndex, 1);

      setAvailableSubjects((prevSubjects) => {
        const updatedSubjects = [...prevSubjects];
        const currentSubject = updatedSubjects[currentSubjectIndex];  
        currentSubject.courses = currentSubject.courses.map((course) => {
          if (
            course.teacher.name === draggedItem.teacher &&
            course.courseType.name === draggedItem.courseType &&
            course.duration === draggedItem.duration &&
            course.pos.x === parseInt(fromKey.split("-")[1], 10) &&
            course.pos.y === parseInt(fromKey.split("-")[0], 10)
          ) {
            return {
              ...course,
              pos: { x: parseInt(toKey.split("-")[1], 10), y: parseInt(toKey.split("-")[0], 10) },
            };
          }
          return course;
        });
        return updatedSubjects;
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
          course.courseType?.name === removedTypeName
            ? {
                ...course,
                courseType: { name: "N/A", color: "#FFFFFF" },
              }
            : course
        ),
      }))
    );
  
    setCurrentCourses((prevCourses) =>
      (prevCourses || []).map((course) =>
        course.courseType?.name === removedTypeName
          ? { ...course, courseType: { name: "N/A", color: "#FFFFFF" } }
          : course
      )
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

  /* Gestion des GROUPES -------------------------------------------- */
  const fetchGroups = async () => {
    try {
      const classID = curriculum.formationLevels[0].id; //Pour l'instant il n'y a qu'une promo par cursus ( BUT1 -> A1 )
      const response = await fetch(routes.dev.groups.getGroups(classID));
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des groups");
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsGroupLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGroups();
  }, []);

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) => 
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  const groupList = getGroupList();

  return (
    <div className="min-h-screen py-10">
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
                groups={groups}
                groupList={groupList}
                setGroups={setGroups}
                fetchGroups={fetchGroups}
                courseTypes={courseTypes}
                setCourseTypes={setCourseTypes}
                updateCoursesForRemovedType={updateCoursesForRemovedType}
                addItem={addItem}
              />
            </div>

            {/* Choix du semestre selon le curriculum */}
            <select
              className="w-fit min-w-28 max-w-60 h-10 mt-2 ml-24 px-2 before:px-4 py-2 default-select rounded-full font-normal"
              value={selectedSemester?.id || ""}
              onChange={handleSemesterChange}>
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
                  setCurrentCourses(nextSubject.courses || []);
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
    </div>
  );
};

export default MainGrid;