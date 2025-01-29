import React from "react";
import Header from "../header/header";

const Statistics = () => {

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center p-6 bg-cover bg-center">
        <div className="flex flex-row justify-between w-full max-w-[90vw] mt-16">
          <div className="h-[70vh] w-[65vw] rounded-lg bg-white shadow-lg p-4">
            Graph et statistiques
          </div>

          <div className="flex flex-col justify-between items-left ml-6">
            <div className="h-[25vh] w-[10vw] rounded-lg bg-white shadow-lg p-4">
              Légende du graph
            </div>
            <div className="h-[40vh] w-[20vw] rounded-lg bg-white shadow-lg p-4">
              graph répartition des heures
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;