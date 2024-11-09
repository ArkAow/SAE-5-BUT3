import React, { useState } from "react";
import Grid from "./MainGrid";
import Header from "../Header/Header";
import "./PreviEdit.css"; // Pour ajouter un style de base si nécessaire

const MainPreviEdit = () => {
  return (
    <div className="MainPreviEdit">
      <Header />
      <Grid />
    </div>
  );
};

export default MainPreviEdit;
