import React from "react";
import routes from "../../../Routes/routes";

export const SaveButton = ({ items }) => {
  
  const handleSave = async () => {
    try {
      for (const course of items) {
        const response = await fetch(routes.dev.courses.add(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            duration: course.duration,
            positionX: course.pos.x,
            positionY: course.pos.x,
            teacher: course.teacher,
            courseType: course.courseType,
            subject: course.subject,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la sauvegarde du cours ${course.id}`);
        }
      }

      alert("Tous les cours ont été sauvegardés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert("Une erreur s'est produite lors de la sauvegarde des cours.");
    }
  };

  return (
    <button className="btn-control-panel" onClick={handleSave}>
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
