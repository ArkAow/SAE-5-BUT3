import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";

const ModifyGroups = () => {
  const navigate = useNavigate();
  const goToHomePage = () => navigate("/homePage");
  const goToManageData = () => navigate("/ManageData");

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-around items-center">
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

      </div>
    </>
  );
};

export default ModifyGroups;
