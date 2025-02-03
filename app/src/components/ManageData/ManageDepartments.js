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
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageDepartments;