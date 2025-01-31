import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import useGroups from "../../hooks/useGroups.js";

const ModifyGroups = () => {
  const navigate = useNavigate();
  const goToHomePage = () => navigate("/homePage");
  const goToManageData = () => navigate("/ManageData");
  const { groups, isGroupLoading, getGroupList } = useGroups(curriculum);

  return (
    <>
      <Header />

      {/* Navigation */}
      <div className="absolute flex flex-row items-center top-16 left-10 space-x-4">
        <div 
          className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img src="/images/home.svg" className="w-8 h-8"/>
        </div>
        <div 
          className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
          onClick={goToManageData}>
          <img src="/images/options.svg" className="w-8 h-8"/>
        </div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center px-8">
        
        <div className="flex justify-around w-full mx-10 mt-40">
          
          {/* Niveaux de formation */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Niveaux de formation
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Demi-groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Demi-groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ModifyGroups;