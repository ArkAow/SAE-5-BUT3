import React from "react";
import routes from "../../../Routes/routes";

export const SaveButton = ({ modifiedCourses, setModifiedCourses, setToast, isSaving, setSaving }) => {  
  const handleSave = async () => {
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
          ...(course.groupInfo.groupType === "formation_level" && { formationLevelId: course.groupInfo.groupID }),
          ...(course.groupInfo.groupType === "group" && { groupPosition: course.groupInfo.groupID }),
          ...(course.groupInfo.groupType === "half_group" && { halfGroupId: course.groupInfo.groupID }),
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
