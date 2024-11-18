import React from "react";
import MainGrid from "./MainGrid";
import Header from "../header/header";

const MainPreviEdit = () => {
  return (
    <div className="MainPreviEdit">
      <Header />
      <div className="absolute h-screen w-screen bg-cover bg-center bg-landscape -z-10"/>
      <MainGrid />
    </div>
  );
};

export default MainPreviEdit;
