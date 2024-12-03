import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";

const MainGrid = ({ curriculum }) => {
  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1.0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

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

  {/* Gestion des SEMESTRES et MATIERES -------------------------------------------- */}
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch(
          `http://localhost:8600/api/curriculum/${curriculum.id}/semesters`
        );
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
        alert("Impossible de charger les semestres.");
      }
      finally {
        setIsSemesterLoading(false);
      }
    };

    fetchSemesters();
  }, [curriculum.id]);

  const fetchSubjects = async (semesterId) => {
    try {
      const response = await fetch(
        `http://localhost:8600/api/semester/${semesterId}/subjects`
      );
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des matières.");
      }
      const subjects = await response.json();
      setAvailableSubjects(subjects);
      setSelectedSubject(subjects[0] || null);
      setCurrentCourses(subjects[0]?.courses || []);
    } catch (error) {
      console.error(error);
      alert("Impossible de charger les matières.");
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

  
  {/* Gestion des COURS -------------------------------------------- */}
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const response = await fetch("http://localhost:8600/coursetypes");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des types de cours.");
        }
        const data = await response.json();
        setCourseTypes(data);
        setSelectedCourseType(data[0] || null);
      } catch (error) {
        console.error(error);
        alert("Impossible de charger les types de cours.");
      }
      finally {
        setIsCourseTypeLoading(false);
      }
    };

    fetchCourseTypes();
  }, []);

  const addItem = () => {
    const positionKey = `${selectedRow}-${selectedCol}`;
    const newItem = {
      color: selectedCourseType.color,
      courseType: selectedCourseType.name,
      teacher: selectedTeacher,
      duration: selectedDuration,
      id: Date.now(),
    };
  
    setItems((prevItems) => ({
      ...prevItems,
      [positionKey]: [...(prevItems[positionKey] || []), newItem],
    }));
  
    const newCourse = {
      teacher: { name: selectedTeacher },
      courseType: { name: selectedCourseType.name, color: selectedCourseType.color },
      duration: selectedDuration,
      pos: { x: selectedCol, y: selectedRow },
      id: Date.now(),
    };
  
    setAvailableSubjects((prevSubjects) => {
      const updatedSubjects = prevSubjects.map((subject, index) => {
        if (index === currentSubjectIndex) {
          const updatedCourses = [...(subject.courses || []), newCourse];
          return { ...subject, courses: updatedCourses };
        }
        return subject;
      });
  
      return updatedSubjects;
    });
  
    setCurrentCourses((prevCourses) => [...prevCourses, newCourse]);
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
      prevSubjects.map((subject) => ({
        ...subject,
        courses: subject.courses.map((course) =>
          course.courseType.name === removedTypeName
            ? {
                ...course,
                courseType: { name: "N/A", color: "#FFFFFF" },
              }
            : course
        ),
      }))
    );
  
    setCurrentCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.courseType.name === removedTypeName
          ? { ...course, courseType: { name: "N/A", color: "#FFFFFF" } }
          : course
      )
    );
  
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      for (const key in updatedItems) {
        updatedItems[key] = updatedItems[key].map((item) =>
          item.courseType === removedTypeName
            ? { ...item, courseType: "N/A", color: "#FFFFFF" }
            : item
        );
      }
      return updatedItems;
    });
  };

  {/* Gestion des GROUPES -------------------------------------------- */}
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log(curriculum);
        const classID = curriculum.classes[0].id; //Pour l'instant il n'y a qu'une promo par cursus ( BUT1 -> A1 )
        const response = await fetch(`http://localhost:8600/groups/${classID}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des groups");
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error);
        alert("Impossible de charger les groupes.");
      }
      finally {
        setIsGroupLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const addGroups = async (newGroups) => {
    const actualClassID = curriculum.classes[0].id; //Pour l'instant il n'y a qu'une promo par cursus ( BUT1 -> A1 )

    setGroups((prevGroups) => {
      const existingGroupNames = prevGroups.map((g) => g.name);
      const filteredNewGroups = newGroups.filter(
        (newGroup) => !existingGroupNames.includes(newGroup.name)
      );
      return [...prevGroups, ...filteredNewGroups];
    });

    for (const group of newGroups) {
      try {
        const response = await fetch("http://localhost:8600/add/group", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: group.name,
            halfgroups: group.subGroups || [],
            classID: actualClassID,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("Erreur pour l'ajout du groupe:", result.error);
          alert(`Erreur lors de l'ajout du groupe : ${result.error}`);
        } else {
          console.log("Le groupe a été ajouté avec succès :", result);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion avec l'API:", error);
        alert("Erreur de connexion à l'API.");
      }
    }
  };

  const deleteGroups = (index) => {
    const updatedGroups = groups.filter((_, i) => i !== index);
    setGroups(updatedGroups);
  };

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) => 
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  const GRID_ROW_LENGTH = 25;
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
          <div className="flex items-center justify-start gap-5 h-20 px-10">
            <div className="absolute top-6">
            <ControlPanel
                groups={groups}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                selectedCol={selectedCol}
                setSelectedCol={setSelectedCol}
                courseTypes={courseTypes}
                setCourseTypes={setCourseTypes}
                updateCoursesForRemovedType={updateCoursesForRemovedType}
                selectedCourseType={selectedCourseType}
                setSelectedCourseType={setSelectedCourseType}
                selectedTeacher={selectedTeacher}
                setSelectedTeacher={setSelectedTeacher}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                addItem={addItem}
                addGroups={addGroups}
                deleteGroups={deleteGroups}
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
              <div className="w-1/2 text-center text-primary mt-10 text-lg font-bold p-2 bg-white rounded-full">
                Il n'y a pas de groupes, veuillez en ajouter pour consulter le tableau.
              </div>
            </div>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <div className="ml-36 rounded-lg overflow-auto max-h-[75vh] min-h-[25rem] max-w-[85vw] -z-10">
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
                  {Array.from({ length: GRID_ROW_LENGTH }).map((_, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                      <div className="h-20 w-10 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                        S{rowIndex + 1}
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