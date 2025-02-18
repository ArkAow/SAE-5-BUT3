import React, { useState, useEffect } from "react";
import { CourseButton } from "./CourseButton";
import { PrintButton } from "./PrintButton";
import { CourseTypeButton } from "./CourseTypeButton";
import { SaveButton } from "./SaveButton";

const ControlPanel = ({
  isExpanded,
  setIsExpanded,

  fetchSemesters,
  selectedSemester,

  setToast,
  teachers,

  groups,
  groupList,

  courseTypes,
  setCourseTypes,
  updateCoursesForRemovedType,
  addItem,
  modifiedCourses,
  setModifiedCourses,
  deletedCourses,
  setDeletedCourses,
  isSaving,
  setSaving }) => {
  const [delayedExpanded, setDelayedExpanded] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNoGroups, setIsNoGroups] = useState(true);
  const [isModifiedCourses, setIsModifiedCourses] = useState(false);
  const [isDeletedCourses, setIsDeletedCourses] = useState(false);

  useEffect(() => {
    setIsNoGroups(groups.length === 0);
  }, [groups]);
  useEffect(() => {
    setIsModifiedCourses(modifiedCourses.length > 0);
  }, [modifiedCourses]);
  useEffect(() => {
    setIsDeletedCourses(deletedCourses.length > 0);
  }, [deletedCourses]);

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

  return (
    <div
      className={`relative z-0 mr-5 mt-10 p-5 bg-primary rounded-3xl shadow-md transition-all duration-300 flex flex-col place-items-center ${isExpanded ? "h-[84.5vh] w-20" : "h-20 w-20"}`}>
      <button
        onClick={handleToggleExpand}
        className={`${
          isExpanded
            ? "size-10 bg-primaryshade rounded-full flex items-center justify-center"
            : "size-10 bg-white rounded-lg flex items-center justify-center"}`}
        disabled={isButtonDisabled}>

        <span className={`absolute right-4 top-4 flex h-3 w-3 ${!(isModifiedCourses || isDeletedCourses) || isExpanded ? "hidden" : ""}`}>
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
          groups={groups}
          groupList={groupList}
          selectedSemester={selectedSemester}
          courseTypes={courseTypes}
          addItem={addItem}
          teachers={teachers}/>

        <CourseTypeButton 
          isNoGroups={isNoGroups}
          courseTypes={courseTypes}
          setCourseTypes={setCourseTypes}
          updateCoursesForRemovedType={updateCoursesForRemovedType}/>

        <PrintButton />

        <SaveButton
          isNoGroups={isNoGroups}
          fetchSemesters={fetchSemesters}
          modifiedCourses={modifiedCourses}
          setModifiedCourses={setModifiedCourses}
          isModifiedCourses={isModifiedCourses}
          deletedCourses={deletedCourses}
          setDeletedCourses={setDeletedCourses}
          isDeletedCourses={isDeletedCourses}
          setToast={setToast}
          isSaving={isSaving}
          setSaving={setSaving}/>
      </div>
    </div>
  );
};

export default ControlPanel;
