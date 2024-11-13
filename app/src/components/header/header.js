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
    <div className="flex w-full fixed top-0 z-20 justify-between items-center bg-primary p-2">
      <div className="flex items-center">
        <img
          src="/images/Universite_de_Limoges_white.png"
          alt="Logo"
          className="size-[6%] mr-2 cursor-pointer hover:opacity-50" onClick={goToHomePage}
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
        />
        <img
          src="/images/square.svg"
          alt="Maximize"
          className="btn-header"
          onClick={() =>handleWindowControl('maximize')}
        />
        <img
          src="/images/cross.svg"
          alt="Close"
          className="btn-header"
          onClick={() => handleWindowControl('close')}
        />
      </div>
    </div>
  );
};

export default Header;
