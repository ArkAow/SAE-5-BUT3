import React from "react";
import Header from "../header/header.js";
import { useNavigate } from "react-router-dom";

const ManageData = () => {
  const navigate = useNavigate();

  const goToManageTeacher = () => navigate("/ManageTeachers");
  const goToModifyGroups = () => navigate("/ModifyGroups");
  const goToManageDepartments = () => navigate("/ManageDepartments");
  const goToManageUsers = () => navigate("/ManageUsers");
  const goToInsertM3C = () => navigate("/InsertM3C");
  const goToHomePage = () => navigate("/homePage");

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-around items-center">
        
        {/* Navigation */}
        <div 
          className="absolute flex flex-row items-center top-16 left-10 py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img src="/images/home.svg" className="size-8"/>
        </div>
        
        <div className="w-full max-w-[1000px] flex flex-col items-center mt-20 px-8 space-y-10">
            {/* Première ligne (2 boutons) */}
            <div className="flex flex-row gap-x-8 w-full justify-center">
                {/* Insert M3C */}
                <div className="bg-black bg-opacity-70 size-[280px] rounded-2xl p-2 transition-transform duration-200 hover:scale-105 cursor-pointer flex flex-col justify-center items-center"
                onClick={goToInsertM3C}>
                    <div className="size-[150px] md:size-[200px] m-5 bg-primary flex justify-center items-center rounded-2xl shadow-lg">
                        <div className="text-white text-5xl font-bold">M3C</div>
                    </div>
                    <p className="text-white text-lg text-center">Insérer le M3C</p>
                </div>

                {/* Manage Teachers */}
                <div className="bg-black bg-opacity-70 size-[280px] rounded-2xl p-2 transition-transform duration-200 hover:scale-105 cursor-pointer flex flex-col justify-center items-center"
                onClick={goToManageTeacher}>
                    <div className="size-[150px] md:size-[200px] m-5 bg-primary flex justify-center items-center rounded-2xl shadow-lg">
                        <img src="/images/profile_picture_anonym.png" className="size-[90px] md:size-[120px]"/>
                    </div>
                    <p className="text-white text-lg text-center">Modifier les enseignants</p>
                </div>
            </div>

            {/* Deuxième ligne (3 boutons) */}
            <div className="grid grid-cols-3 gap-x-8 w-full">
                {/* Modify Groups */}
                <div className="bg-black bg-opacity-70 size-[280px] rounded-2xl p-2 transition-transform duration-200 hover:scale-105 cursor-pointer flex flex-col justify-center items-center"
                onClick={goToModifyGroups}>
                    <div className="size-[130px] md:size-[200px] m-5 bg-primary flex justify-center items-center rounded-2xl shadow-lg">
                        <img src="/images/student.svg" className="size-[80px] md:size-[100px]"/>
                    </div>
                    <p className="text-white text-lg text-center">Modifier les groupes</p>
                </div>

                {/* Manage Departments */}
                <div className="bg-black bg-opacity-70 size-[280px] rounded-2xl p-2 transition-transform duration-200 hover:scale-105 cursor-pointer flex flex-col justify-center items-center"
                onClick={goToManageDepartments}>
                    <div className="size-[130px] md:size-[200px] m-5 bg-primary flex justify-center items-center rounded-2xl shadow-lg">
                        <img src="/images/school.svg" className="size-[80px] md:size-[100px]"/>
                    </div>
                    <p className="text-white text-lg text-center">Gérer les départements</p>
                </div>

                {/* Manage Users */}
                <div className="bg-black bg-opacity-70 size-[280px] rounded-2xl p-2 transition-transform duration-200 hover:scale-105 cursor-pointer flex flex-col justify-center items-center"
                onClick={goToManageUsers}>
                    <div className="size-[130px] md:size-[200px] m-5 bg-primary flex justify-center items-center rounded-2xl shadow-lg">
                        <img src="/images/configuration.svg" className="size-[80px] md:size-[100px]"/>
                    </div>
                    <p className="text-white text-lg text-center">Gérer les utilisateurs</p>
                </div>
            </div>
        </div>            
      </div>
    </>
  );
};

export default ManageData;