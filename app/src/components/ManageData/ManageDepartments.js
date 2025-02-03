import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";

const ManageDepartments = () => {

  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  const goToManageData = () => {
    navigate("/ManageData");
  }; 

  return (
    <>
      <Header />

      {/* Navigation */}
      <div className="absolute flex flex-row items-center top-16 left-10 space-x-2">
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img 
              src="/images/home.svg"
              className="size-8"/>
        </div>
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToManageData}>
          <img 
              src="/images/options.svg"
              className="size-8"/>
        </div>
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center w-full mt-40">
          <div className="w-full mx-10 h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
              <h2 className="text-white text-center text-lg font-bold mb-4">
                Départements
              </h2>
              <ul className="space-y-4">
                <li className="flex justify-around items-center bg-white rounded-lg p-2">
                  {/* Texte centré avec le reste de l'espace */}
                  <div className="text-base text-black w-full flex flex-row justify-between ml-2 mr-12">
                    <span className="font-semibold"> Département Informatique de Limoges </span>
                    <span> x cursus associés </span>
                    <span> x membres </span>
                  </div>
                  {/* Boutons alignés à droite */}
                  <div className="flex space-x-2">
                    <button className="size-6 lex justify-center items-center">
                      <img src="images/pen.svg" alt="Modifier" className="size-6" />
                    </button>
                    <button className="size-6 flex justify-center items-center">
                      <img src="images/trash.svg" alt="Fermer" className="size-6" />
                    </button>
                  </div>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageDepartments;