import React from "react";
import Header from "../header/header.js";
import { useNavigate } from "react-router-dom";

const ManageData = () => {
  const navigate = useNavigate();

  const goToModifyTeacher = () => {
    navigate("/ModifyTeachers");
  };

  const goToInsertM3C = () => {
    navigate("/InsertM3C");
  }; 

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-landscape">
        <Header />
        
        <div className="flex flex-row items-center mt-16 ml-10 py-1 px-8 
            text-white bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg">
            <span 
                onClick={goToHomePage} 
                className="cursor-pointer hover:underline">
                Page d'accueil /
            </span>
            <img src="/images/options.svg" alt="Options Icon" className="w-8 h-8"/>
            <span>
                Gestion des données
            </span>
        </div>
        
        <div className="flex flex-col justify-around items-center">
            <div className="flex justify-around items-center w-full max-w-[1200px] mt-8 px-8">
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
            </div>            
        </div>
    </div>
  );
};

export default ManageData;