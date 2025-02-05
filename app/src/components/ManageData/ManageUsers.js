import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import useDepartments from "../../hooks/useDepartments.js";

import Toast from "../Toast/Toast.js";
import useUsers from "../../hooks/useUsers.js";

const ManageUsers = () => {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const {departments, isLoading: isDepartmentLoading} = useDepartments();
  const {users, isLoading: isUserLoading} = useUsers();

  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  const goToManageData = () => {
    navigate("/ManageData");
  }; 

  return (
    <>
      <Header />

      {/* Navigation */}
      <div className="absolute flex flex-row items-center top-16 left-10 space-x-2">
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToHomePage}>
          <img 
              src="/images/home.svg"
              className="size-8"/>
        </div>
        <div 
          className="flex flex-row items-center py-4 px-4
          bg-black bg-opacity-70 text-xl space-x-4 w-fit rounded-lg cursor-pointer"
          onClick={goToManageData}>
          <img 
              src="/images/options.svg"
              className="size-8"/>
        </div>
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center w-full mt-40">
          <div className="w-full mx-10 h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
              <h2 className="text-white text-center text-lg font-bold mb-4">
                Utilisateurs
              </h2>

              {isUserLoading ? (
                <div className="flex flex-col items-center justify-center  p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des départements...</div>
                </div>
              ) : (
                <>
                  {users.length === 0 ? (
                    <span className="w-full text-center text-white">Il n'y a pas de départements</span>
                  ) : (
                    <ul className="space-y-4">
                      {users.map((user) => (
                        <li key={user.id} className="flex items-center bg-white rounded-lg p-2">
                          <div className="text-base text-black w-full flex flex-row ml-2 mr-12">
                            <span className="w-1/4 text-left font-semibold"> {user.fullname} </span>
                            <span className="w-1/4 text-left"> {user.email} </span>
                            <span className="w-1/4 text-left"> {user.role} </span>
                            <span className="w-1/4 text-left"> son département avec un super nom </span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                            className="size-6 flex justify-center items-center">
                              <img src="images/pen.svg" alt="Modifier" className="size-6" />
                            </button>
                            <button 
                            className="size-6 flex justify-center items-center">
                              <img src="images/trash.svg" alt="Supprmer" className="size-6" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button 
                  className="w-[35%] h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto">
                    <span>Ajouter</span>
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </>
  );
};

export default ManageUsers;