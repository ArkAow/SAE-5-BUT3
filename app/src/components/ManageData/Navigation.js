import React from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute flex flex-row items-center top-16 left-10 space-x-4">
      <div
        className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
        onClick={() => navigate("/homePage")}
      >
        <img src="/images/home.svg" className="w-8 h-8" alt="Home" />
      </div>
      <div
        className="flex items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer"
        onClick={() => navigate("/ManageData")}
      >
        <img src="/images/options.svg" className="w-8 h-8" alt="Options" />
      </div>
    </div>
  );
};

export default Navigation;