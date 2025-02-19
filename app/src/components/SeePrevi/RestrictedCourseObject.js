import React from "react";
import { getShade } from "../../services/colorService";
import { formatDuration } from "../../services/durationService";

const RestrictedCourseObject = ({
  color,
  teacher,
  courseType,
  duration,
}) => {

  return (
    <div
      className="relative size-16 m-1 rounded-lg border-2 transition-opacity duration-200 flex flex-col justify-between p-1"
      style={{
        backgroundColor: color,
        borderColor: getShade(color),
      }}>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5 truncate ">
        {courseType}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2 mb-0.5 truncate ">
        {teacher}
      </div>
      <div className="w-full bg-white h-4 text-xs text-black rounded px-2">
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default RestrictedCourseObject;
