import React from "react";

const Header = () => {
  return (
    <div className="flex justify-start items-start bg-primary">
      <div className="text-white text-2xl p-2">
        <h1 className="font-normal text-base text-white mt-1">Prévisionnelle IUT du Limousin</h1>
      </div>
      <img
        src="/images/Universite_de_Limoges_white.png"
        alt="Profile"
        className="order-first w-[3%] h-[3%] mr-2 mt-1 ml-1 mb-1"/>
    </div>
  );
};

export default Header;
