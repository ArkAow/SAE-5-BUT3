import React, { useEffect,useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";
import { courseTypes } from "../../constants";

const MainGrid = ({curriculum}) => {
  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedCourseType, setSelectedCourseType] = useState(courseTypes[0]);
  const [selectedTeacher, setSelectedTeacher,] = useState("");
  const [selectedDuration, setSelectedDuration,] = useState(1.0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(curriculum.semesters[0]?.name || "");
  const [availableSubjects, setAvailableSubjects] = useState(curriculum.semesters[0]?.subjects || []);
  const [groups, setGroups] = useState(curriculum.groups);
  const [currentCourses, setCurrentCourses] = useState(availableSubjects?.courses || []);


  {/* Pour la gestion des groupes */}
  const addGroups = (newGroups) => {
    setGroups((prevGroups) => {
      const existingGroupNames = prevGroups.map((g) => g.name);
      const filteredNewGroups = newGroups.filter(
        (newGroup) => !existingGroupNames.includes(newGroup.name)
      );
      return [...prevGroups, ...filteredNewGroups];
    });
  };

  const deleteGroups = (index) => {
    const updatedGroups = groups.filter((_, i) => i !== index);
    console.log("Groups after deletion:", updatedGroups);
    setGroups(updatedGroups);
  };
  
  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) => group.subGroups);
    return ["Tous", ...mainGroups, ...subGroups];
  };

  useEffect(() => {
    if (currentCourses.length > 0) {
      const initialItems = {};
      currentCourses.forEach((course, index) => {
        const row = Math.floor(index / groups.length);
        const col = index % groups.length;
        const positionKey = `${row}-${col}`;
        if (!initialItems[positionKey]) {
          initialItems[positionKey] = [];
        }
        initialItems[positionKey].push({
          color: course.courseType.color,
          courseType: course.courseType.name,
          teacher: course.teacher.name || "N/A",
          duration: course.duration || 1.0,
          id: course.id || Date.now() + index,
        });
      });
      setItems(initialItems);
    }
  }, [currentCourses, groups, selectedCourseType]);

  const handleSemesterChange = (e) => {
    const selected = e.target.value;
    setSelectedSemester(selected);
    const semester = curriculum.semesters.find((s) => s.name === selected);
    const subjects = semester ? semester.subjects : [];
    setAvailableSubjects(subjects);
    setCurrentSubjectIndex(0);
    setCurrentCourses(subjects[0]?.courses || []);
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    const semester = curriculum.semesters.find((s) => s.name === selectedSemester);
    const subject = semester.subjects.find((s) => s.name === selectedSubject);

    const subjectIndex = availableSubjects.indexOf(subject);
    setCurrentSubjectIndex(subjectIndex);
    setCurrentCourses(subject?.courses || []);
    
    setItems({});
  };


  const handleNextSubject = () => {
    if (currentSubjectIndex < availableSubjects.length - 1) {
      setCurrentSubjectIndex((prevIndex) => prevIndex + 1);
  
      setItems({});
  
      const nextSubject = availableSubjects[currentSubjectIndex + 1];
      setCurrentCourses(nextSubject?.courses || []);
    }
  };

  {/* Pour la gestion des cours */}
  const addItem = () => {
    const positionKey = `${selectedRow}-${selectedCol}`;
    const newItem = { 
      color: selectedCourseType.color,
      courseType: selectedCourseType.name,
      teacher: selectedTeacher,
      duration: selectedDuration,
      id: Date.now()
    };
    setItems((prevItems) => ({
      ...prevItems,
      [positionKey]: [...(prevItems[positionKey] || []), newItem],
    }));
  };

  const moveItem = (fromKey, toKey) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      if (fromItems.length === 0) return prevItems;
      const draggedItem = fromItems.pop();
      return {
        ...prevItems,
        [fromKey]: fromItems,
        [toKey]: [...toItems, draggedItem],
      };
    });
  };

  const GRID_ROW_LENGTH = 25;
  const groupList = getGroupList();

  return (
    <div className="min-h-screen py-10">
      <div className="flex items-center justify-start gap-5 h-20 px-10">
        <div className="absolute top-6">
          <ControlPanel
            groups={groups}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            selectedCol={selectedCol}
            setSelectedCol={setSelectedCol}
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

        {/* Choix semestre */}
        <select
          className="w-fit min-w-28 max-w-60 h-10 mt-2 ml-24 px-2 before:px-4 py-2 default-select rounded-full font-normal"
          value={selectedSemester}
          onChange={handleSemesterChange}>
          <option value="" disabled>
            Choisir un semestre
          </option>
          {curriculum.semesters.map((semester) => (
            <option key={semester.name} value={semester.name}>
              {semester.name}
            </option>
          ))}
        </select>

        {/* Choix matière */}
        <select
          className="w-fit min-w-28 max-w-60 h-10 mt-2 px-2 before:px-4 py-2 default-select rounded-full font-normal"
          value={availableSubjects[currentSubjectIndex]?.name || ""}
          onChange={handleSubjectChange}>
          <option value="" disabled>
            Choisir une matière
          </option>
          {availableSubjects.map((subject) => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>

        {/* Bouton suivant */}
        <button 
          onClick={handleNextSubject}
          disabled={currentSubjectIndex >= availableSubjects.length - 1}
          className={`flex w-48 h-10 mt-2 items-center px-4 py-2 text-white bg-primary rounded-full
            shadow-md hover:bg-primaryshade focus:bg-primarytint border border-white focus:outline-none
            ${currentSubjectIndex >= availableSubjects.length - 1 ? "bg-primaryshade cursor-not-allowed" : ""}`}>
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
                  className={`w-full h-6 bg-gray-200 flex items-center justify-center text-black text-sm font-bold`}>
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
                        moveItem={moveItem}/>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </DndProvider>
      )}
    </div>
  );
};

export default MainGrid;
