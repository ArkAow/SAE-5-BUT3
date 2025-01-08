import React from "react";
import routes from "../../../Routes/routes";
import { determineCourseGroup } from "../../../services/courseGroupService";

export const SaveButton = ({ subjects, groups, groupList, setToast, isSaving, setSaving }) => {  
  const handleSave = () => {
    setSaving(true);
  
    subjects.forEach((subject) => {
      if (subject.courses) {
        subject.courses.forEach((course) => {
          const courseGroupType = determineCourseGroup(course, groups, groupList);
          const IS_COURSE_GROUP_TYPE_HALF_GROUP = courseGroupType == 'half_group';
          const IS_COURSE_GROUP_TYPE_GROUP = courseGroupType == 'group';
          const IS_COURSE_GROUP_TYPE_FORMATION_LEVEL = courseGroupType == 'formation_level';

          const payload = {
            teacher: course.teacher.id,
            courseType: course.courseType.name,
            duration: course.duration,
            group: course.group?.id,
          };
        });
      }
    });

    setToast({
      message: "Prévisionnel sauvegardé avec succès",
      type: "success",
      visible: true,
    });
    setSaving(false);
  };

  return (
    <button className={`btn-control-panel ${isSaving ? 'bg-white cursor-wait' : ''}`} onClick={handleSave}>
      <img
        src="/images/save.svg"
        alt="save icon"
        className="w-10 h-10"
        draggable="false"
      />
    </button>
  );
};

export default SaveButton;
