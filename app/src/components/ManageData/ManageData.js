import React from "react";
import Header from "../header/header.js";
import { useNavigate } from "react-router-dom";

const ManageData = () => {
  const navigate = useNavigate();

  const goToModifyTeacher = () => {
    navigate("/ModifyTeachers");
  };

  const goToModifyGroups = () => {
    navigate("/ModifyGroups");
  };

  const goToInsertM3C = () => {
    navigate("/InsertM3C");
  }; 

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  return (
    <>
        <Header />
        <div className="min-h-screen flex flex-col justify-around items-center">
            {/* Navigation */}
            <div 
                className="absolute flex flex-row items-center top-16 left-10 py-4 px-4
                bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
                onClick={goToHomePage}>
                <img 
                    src="/images/home.svg"
                    className="size-8"/>
            </div>
            
            <div className="flex justify-around items-center w-full max-w-[1200px] mt-40 px-8">
                {/* Insert M3C Block */}
                <div
                    className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
                    onClick={goToInsertM3C}>
                    <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
                        <div className="text-white text-6xl lg:text-8xl font-bold">M3C</div>
                    </div>
                    <p className="text-white text-xl text-center pb-6">
                        Insérer le M3C
                    </p>
                </div>

                {/* Modify Teacher Block */}
                <div
                    className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
                    onClick={goToModifyTeacher}>
                    <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
                        <div className="text-white text-6xl font-bold">
                            <img src="/images/profile_picture_anonym.png" className="size-[70px] md:size-[100px] lg:size-[200px]"/>
                        </div>
                    </div>
                    <p className="text-white text-xl text-center pb-6">
                        Modifier les enseignants
                    </p>
                </div>

                {/* Modify Groups Block */}
                <div
                    className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
                    onClick={goToModifyGroups}>
                    <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
                        <div className="text-white text-6xl font-bold">
                            <img src="/images/student.svg" className="size-[70px] md:size-[100px] lg:size-[200px]"/>
                        </div>
                    </div>
                    <p className="text-white text-xl text-center pb-6">
                        Modifier les groupes d’étudiants
                    </p>
                </div>
            </div>            
        </div>
    </>
  );
};

export default ManageData;