import React from "react";
import routes from "../../../Routes/routes";

export const SaveButton = ({ isNoGroups ,modifiedCourses, setModifiedCourses, setToast, isSaving, isModifiedCourses, setSaving }) => {  
  const handleSave = async () => {
    if (!isModifiedCourses) {
      console.error("aucun cours à sauvegarder");
      return;
    }
    setSaving(true);
    let hasError = false;

    try {
      for (const course of modifiedCourses) {
        const payload = {
          id: course.id || undefined, // Ajout de l'ID pour mise à jour
          teacherId: course.teacher?.id,
          courseTypeName: course.courseType?.name,
          duration: course.duration,
          subjectId: course.subject?.id,
          weekPosition: course.pos?.y,
          ...(course.group.groupType === "formation_level" && { formationLevelId: course.group.groupID }),
          ...(course.group.groupType === "group" && { groupId: course.group.groupID }),
          ...(course.group.groupType === "half_group" && { halfGroupId: course.group.groupID }),
        };

        const response = await fetch(routes.dev.courses.save(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Erreur lors de la sauvegarde du cours :`, errorData);
          hasError = true;
        } else {
          console.log(`Cours ajouté :`,payload);
        }
      }

      setToast({
        message: hasError ? "Certaines erreurs se sont produites lors de la sauvegarde." : "Prévisionnel sauvegardé avec succès.",
        type: hasError ? "error" : "success",
        visible: true,
      });
    } catch (error) {
      console.error("Erreur inattendue :", error);
      setToast({
        message: "Erreur inattendue lors de la sauvegarde.",
        type: "error",
        visible: true,
      });
    } finally {
      setSaving(false);
      setModifiedCourses([]); //On vide la liste des cours à sauvegarder
    }
  };

  return (
    <div className="relative">
      <button 
        className={`btn-control-panel ${isSaving ? 'bg-white cursor-wait' : ''}`} 
        onClick={handleSave}
        disabled={isNoGroups}>
        <span
          className={`absolute right-1 top-1 flex h-3 w-3 ${
            isModifiedCourses ? "" : "hidden"
          }`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
        <img
          src="/images/save.svg"
          alt="save icon"
          className="w-10 h-10"
          draggable="false"
        />
      </button>      
    </div>

  );
};

export default SaveButton;
