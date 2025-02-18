import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import { useUserContext } from "../../contexts/UserContext"; // Import du UserContext

const HomePage = () => {
  const navigate = useNavigate();

  const { fullName } = useUserContext(); // Récupère fullName depuis le contexte

  const goToPreviEdit = () => {
    navigate("/PreGridEdit");
  };

  const goToSeePrevi = () => {
    navigate("/SeePrevi");
  };

  const goToManageData = () => {
    navigate("/ManageData");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-around items-center">
        <div className="absolute flex justify-center items-center top-16">
          <h1 className="text-white text-4xl font-bold text-outline bg-black bg-opacity-70 p-4 rounded-lg">
            Bienvenue, {fullName} !
          </h1>
        </div>
        <div className="flex justify-between items-center w-full max-w-[1200px] mt-40 px-8">
          {/* Modify Previ Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
            onClick={goToPreviEdit}>
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <img
                src="/images/previ-edit.svg"
                alt="icone"
                className="size-[70px] md:size-[100px] lg:size-[200px]"/>
            </div>
            <p className="text-white text-xl text-center pb-6">
              Modifier le prévisionnel
            </p>
          </div>

          {/* Insert Data Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 hover:scale-105"
            onClick={goToManageData}>
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <img
                src="/images/options.svg"
                alt="options"
                className="size-[70px] md:size-[100px] lg:size-[200px]"
              />
            </div>
            <p className="text-white text-xl text-center pb-6">
              Gestion des données
            </p>
          </div>

          {/* See Previ Block */}
          <div
            className="bg-black bg-opacity-70 rounded-2xl transform transition-transform duration-200 cursor-not-allowed"
            disabled>
            <div className="size-[100px] md:size-[200px] lg:size-[300px] m-7 bg-primary flex justify-center items-center rounded-2xl shadow-lg cursor-pointer">
              <img
                src="/images/previ-see.svg"
                alt="icone"
                className="size-[70px] md:size-[100px] lg:size-[200px]"/>
            </div>
            <p className="text-white text-xl text-center pb-6">
              Consulter le prévisionnel
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
