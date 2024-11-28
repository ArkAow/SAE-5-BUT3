import React from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {

  const navigate = useNavigate();

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
  return (
    <div className="flex w-full fixed top-0 z-20 justify-between items-center bg-primary p-2"style={{ WebkitAppRegion: "drag"}}>
      
      <div className="flex items-center">
        <img
          src="/images/Universite_de_Limoges_white.png"
          style={{ WebkitAppRegion: "no-drag"}}
          alt="Logo"
          className="size-[6%] mr-2 cursor-pointer hover:opacity-50" onClick={goToHomePage}
          draggable="false"
        />
        <h1 className="font-normal text-base text-white mt-1">
          Prévisionnel IUT du Limousin
        </h1>
      </div>

      <div className="flex space-x-2" style={{ WebkitAppRegion: "no-drag"}}>
        <img
          src="/images/underline.svg"
          alt="Minimize"
          className="btn-header" 
          onClick={() => handleWindowControl('minimize')}
          draggable="false"
        />
        <img
          src="/images/square.svg"
          alt="Maximize"
          className="btn-header"
          onClick={() =>handleWindowControl('maximize')}
          draggable="false"
        />
        <img
          src="/images/cross.svg"
          alt="Close"
          className="btn-header"
          onClick={() => handleWindowControl('close')}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default Header;
