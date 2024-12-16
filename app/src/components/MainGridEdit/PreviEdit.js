import React from "react";
import MainGrid from "./MainGrid";
import Header from "../header/header";
import { useLocation } from "react-router-dom";

const MainPreviEdit = () => {
  const location = useLocation();
  const { selectedCurriculum } = location.state || {}; // Récupérer le cursus sélectionné

  if (!selectedCurriculum) {
    return <div>Aucun cursus sélectionné.</div>;
  }

  return (
    <div className="MainPreviEdit">
      <Header />
      <div className="absolute h-screen w-screen bg-cover bg-center bg-landscape -z-10" />
      {/* Transmettre le cursus sélectionné au composant MainGrid */}
      <MainGrid curriculum={selectedCurriculum} />
    </div>
  );
};

export default MainPreviEdit;
