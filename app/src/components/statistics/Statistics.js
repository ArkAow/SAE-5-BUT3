import React from "react";

const Statistics = () => {

  return (
    <>
      <div className="min-h-max flex flex-col items-left ml-10 pt-6">
        <div className="flex flex-row justify-between w-full max-w-[90vw] mt-2">
          <div className="h-[65vh] w-[65vw] min-w-[40rem] rounded-lg bg-white shadow-lg p-4">
            Graph et statistiques
          </div>

          <div className="flex flex-col justify-between items-left ml-6 relative">
            <div className="flex flex-row">
              <div className="h-[20vh] w-1/2 rounded-lg bg-white shadow-lg p-4">
                Légende du graph
              </div>
            </div>

            <div className="h-[35vh] w-[20vw] min-w-64 rounded-lg bg-white shadow-lg p-4">
              Graph répartition des heures
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;