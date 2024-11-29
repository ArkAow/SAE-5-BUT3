import React, { useState, useEffect } from "react";
import { CourseButton } from "./CourseButton";
import { GroupButton } from "./GroupButton";
import { PrintButton } from "./PrintButton";
import { CourseTypeButton } from "./CourseTypeButton"

const ControlPanel = ({
  groups,
  selectedRow,
  setSelectedRow,
  selectedCol,
  setSelectedCol,
  courseTypes,
  setCourseTypes,
  updateCoursesForRemovedType,
  selectedCourseType,
  setSelectedCourseType,
  selectedTeacher,
  setSelectedTeacher,
  selectedDuration,
  setSelectedDuration,
  addItem,
  addGroups,
  deleteGroups }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [delayedExpanded, setDelayedExpanded] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNoGroups, setIsNoGroups] = useState(true);

  useEffect(() => {
    setIsNoGroups(groups.length === 0);
  }, [groups]);

  const handleToggleExpand = () => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);
    setIsExpanded((prev) => {
      const newExpandedState = !prev;
      if (newExpandedState) {
        setTimeout(() => setDelayedExpanded(true), 300);
      } else {
        setDelayedExpanded(false);
      }
      return newExpandedState;
    });
    setTimeout(() => setIsButtonDisabled(false), 300);
  };

  const handleUpdateGroups = (newGroups) => {
    if (addGroups) {
      addGroups(newGroups);
    }
  };

  return (
    <div
      className={`relative z-0 mr-5 mt-10 p-5 bg-primary rounded-3xl shadow-md transition-all duration-300 flex flex-col place-items-center ${isExpanded ? "h-[83.5vh] w-20" : "h-20 w-20"}`}>
      <button
        onClick={handleToggleExpand}
        className={`${
          isExpanded
            ? "size-10 bg-primaryshade rounded-full flex items-center justify-center"
            : "size-10 bg-white rounded-lg flex items-center justify-center"}`}
        disabled={isButtonDisabled}>

        <span className={`absolute right-4 top-4 flex h-3 w-3 ${(!isNoGroups || isExpanded) ? "hidden" : ""}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
        
        <img
          src={isExpanded ? "/images/minus.svg" : "/images/plus.svg"}
          alt={isExpanded ? "collapse icon" : "expand icon"}
          className="w-7 h-7 fill-primary"
          draggable="false"/>
      </button>

      <div className={`grid grid-rows-4 gap-4 min-h-fit mt-4 justify-items-start transition-all 
        ${delayedExpanded ? "duration-300 opacity-100 scale-100" : "duration-0 absolute opacity-0 scale-0"}`}>
        <CourseButton
          isNoGroups={isNoGroups}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          selectedCol={selectedCol}
          setSelectedCol={setSelectedCol}
          courseTypes={courseTypes}
          selectedCourseType={selectedCourseType}
          setSelectedCourseType={setSelectedCourseType}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          addItem={addItem}/>
        <CourseTypeButton 
          isNoGroups={isNoGroups}
          courseTypes={courseTypes}
          setCourseTypes={setCourseTypes}
          updateCoursesForRemovedType={updateCoursesForRemovedType}/>
        <GroupButton 
          isNoGroups={isNoGroups}
          groups={groups}
          addGroups={handleUpdateGroups}
          deleteGroups={deleteGroups} />

        <PrintButton />
      </div>
    </div>
  );
};

export default ControlPanel;
