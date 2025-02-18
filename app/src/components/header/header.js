import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import de useLocation pour détecter la route actuelle
import { useUserContext } from "../../contexts/UserContext"; // Import du UserContext

const Header = () => {
  const { fullName } = useUserContext(); // Récupère fullName depuis le contexte
  const navigate = useNavigate();
  const location = useLocation(); // Pour détecter la route actuelle

  const handleWindowControl = (action) => {
    if (window.electronAPI && window.electronAPI.controlWindow) {
      window.electronAPI.controlWindow(action);
    } else {
      console.error("electronAPI ou controlWindow n'est pas défini.");
    }
  };

  const goToHomePage = () => {
    navigate("/homePage");
  };

  // Vérifie si l'utilisateur est sur la page de login (racine "/")
  const isLoginPage = location.pathname === "/";

  const getShortName = (fullName) => {
    if (fullName === "Administrateur") { return "Admin"; }
    const regex = /\b\w+\s\w/;
    const match = fullName.match(regex);
    return match ? match[0] : "Profil";
  };

  return (
    <div
      className="flex w-full fixed top-0 z-20 justify-between items-center bg-primary p-2"
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="flex items-center">
        <img
          src="/images/Universite_de_Limoges_white.png"
          style={{ WebkitAppRegion: "no-drag" }}
          alt="Logo"
          className="size-[6%] mr-2 cursor-pointer hover:opacity-50"
          onClick={goToHomePage}
          draggable="false"
        />
        <h1 className="font-normal text-base text-white mt-1">
          Prévisionnel IUT du Limousin
        </h1>
      </div>

      {/* Section centrale avec ou sans le message */}
      <div className="flex-grow flex justify-end items-center">
        {!isLoginPage && fullName && (
          <>
            <img src="/images/profile.svg" alt="User" className="size-8 mr-2" />
            <p className="text-white text-lg font-semibold text-right mr-4">
              {getShortName(fullName)}
            </p>
          </>
        )}
      </div>

      <div className="flex space-x-2" style={{ WebkitAppRegion: "no-drag" }}>
        <img
          src="/images/underline.svg"
          alt="Minimize"
          className="btn-header"
          onClick={() => handleWindowControl("minimize")}
          draggable="false"
        />
        <img
          src="/images/square.svg"
          alt="Maximize"
          className="btn-header"
          onClick={() => handleWindowControl("maximize")}
          draggable="false"
        />
        <img
          src="/images/cross.svg"
          alt="Close"
          className="btn-header"
          onClick={() => handleWindowControl("close")}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default Header;
