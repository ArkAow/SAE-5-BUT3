import React, { useState } from "react";
import { CourseButton } from "./CourseButton";
import { GroupButton } from "./GroupButton";
import { CommentaryButton } from "./CommentaryButton";
import { PrintButton } from "./PrintButton";

const ControlPanel = ({ selectedRow, setSelectedRow, selectedCol, setSelectedCol, selectedColor, setSelectedColor, addItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [delayedExpanded, setDelayedExpanded] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      className={`relative z-0 mr-5 mt-10 p-5 bg-primary rounded-3xl shadow-md transition-all duration-300 flex flex-col items-center justify-between ${
        isExpanded ? "h-[25rem] w-20" : "h-20 w-20"}`}>

      <button
        onClick={handleToggleExpand}
        className={`${
          isExpanded
            ? "w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
            : "w-10 h-10 bg-white rounded-lg flex items-center justify-center"}`}
        disabled={isButtonDisabled}>
        <img
          src={isExpanded ? "/images/minus.svg" : "/images/plus.svg"}
          alt={isExpanded ? "collapse icon" : "expand icon"}
          className="w-7 h-7 fill-primary"/>
      </button>

      <div className={`grid grid-rows-4 gap-3 items-center mt-4 transition-all ${
        delayedExpanded ? "duration-300 opacity-100 scale-100" : "duration-0 absolute opacity-0 scale-0"}`}>
        <CourseButton 
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          selectedCol={selectedCol}
          setSelectedCol={setSelectedCol}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          addItem={addItem}/>
        <GroupButton />
        <CommentaryButton />
        <PrintButton />
      </div>
    </div>
  );
};

export default ControlPanel;
