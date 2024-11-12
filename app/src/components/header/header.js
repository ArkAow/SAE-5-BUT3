import React from "react";
const Header = () => {
  const handleWindowControl = (action) => {
    if (window.electronAPI && window.electronAPI.controlWindow) {
      window.electronAPI.controlWindow(action);
    } else {
      console.error("electronAPI ou controlWindow n'est pas défini.");
    }
  };
  return (
    <div className="flex justify-between items-center bg-primary p-2">
      <div className="flex items-center">
        <img
          src="/images/Universite_de_Limoges_white.png"
          alt="Logo"
          className="w-[3%] h-[3%] mr-2"
        />
        <h1 className="font-normal text-base text-white mt-1">
          Prévisionnelle IUT du Limousin
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
