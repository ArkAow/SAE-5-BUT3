import React, { useState, useEffect } from "react";
import { PrintButton } from "./PrintButton";;

const RestrictedControlPanel = ({
  isExpanded,
  setIsExpanded,
  showStatistics}) => {
  const [delayedExpanded, setDelayedExpanded] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (showStatistics && isExpanded) handleToggleExpand();
  }, [showStatistics]);

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
      className={`relative z-0 mr-5 mt-10 p-5 bg-primary rounded-3xl shadow-md transition-all duration-300 flex flex-col place-items-center ${isExpanded ? "h-[calc(80px+65vh+2rem)] w-20" : "h-20 w-20"}`}>
      <button
        onClick={handleToggleExpand}
        className={`${
          isExpanded
            ? "size-10 bg-primaryshade rounded-full flex items-center justify-center"
            : "size-10 bg-white rounded-lg flex items-center justify-center disabled:bg-primaryshade disabled:cursor-not-allowed transition-colors duration-300"}`}
        disabled={isButtonDisabled || showStatistics}>
        
        <img
          src={isExpanded ? "/images/minus.svg" : "/images/plus.svg"}
          alt={isExpanded ? "collapse icon" : "expand icon"}
          className="w-7 h-7 fill-primary"
          draggable="false"/>
      </button>

      <div className={`grid grid-rows-4 gap-4 min-h-fit mt-4 justify-items-start transition-all 
        ${delayedExpanded ? "duration-300 opacity-100 scale-100" : "duration-0 absolute opacity-0 scale-0"}`}>
        <PrintButton />
      </div>
    </div>
  );
};

export default RestrictedControlPanel;
