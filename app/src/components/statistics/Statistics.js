import React from "react";
import Header from "../header/header";

const Statistics = () => {

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center p-6 bg-cover bg-center">
        <div className="flex flex-row justify-between w-full max-w-[90vw] mt-16">
          <div className="h-[70vh] w-[65vw] min-w-[40rem] rounded-lg bg-white shadow-lg p-4">
            Graph et statistiques
          </div>

          <div className="flex flex-col justify-between items-left ml-6 relative">
            <div className="flex flex-row">
              <div className="h-[25vh] w-1/2 rounded-lg bg-white shadow-lg p-4">
                Légende du graph
              </div>
              <button
                onClick={() => window.history.back()}
                className="w-28 h-10 px-2 mx-auto flex items-center justify-around btn-default">
                Retour
                <img src="/images/back.svg" className="size-5" alt="Retour" />
              </button>
            </div>

            <div className="h-[40vh] w-[20vw] min-w-64 rounded-lg bg-white shadow-lg p-4">
              Graph répartition des heures
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;