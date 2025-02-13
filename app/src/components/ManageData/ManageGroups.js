import React, { useState } from "react";
import Header from "../header/header.js";
import Navigation from "./Navigation.js";
import DepartmentSelect from "./DepartmentSelect.js";
import useGroups from "../../hooks/useGroups.js";
import useCurriculums from "../../hooks/useCurriculums.js";
import { useUserContext } from "../../contexts/UserContext.js";

const ManageGroups = () => {
  const { departments } = useUserContext();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || null);
  
  const { curriculums, error, loading } = useCurriculums();
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const { groups, isGroupLoading, getGroupList } = useGroups(selectedCurriculum);

  return (
    <>
      <Header />
      <Navigation />
      <DepartmentSelect 
        departments={departments} 
        selectedDepartment={selectedDepartment} 
        setSelectedDepartment={setSelectedDepartment} />

      <div className="min-h-screen flex flex-col justify-center items-center px-8">
        <div className="flex justify-around w-full mx-10 mt-40">
          
          {/* Niveaux de formation */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Niveaux de formation
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {loading ? (
                <p className="text-white text-center">Chargement...</p>
              ) : error ? (
                <p className="text-red-500 text-center">Erreur : {error}</p>
              ) : (
                curriculums.map((curriculum) => (
                  <div
                    key={curriculum.id}
                    onClick={() => setSelectedCurriculum(curriculum)}
                    className={`p-2 cursor-pointer rounded-lg ${
                      selectedCurriculum?.id === curriculum.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {curriculum.name}
                  </div>
                ))
              )}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg mx-4 flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

          {/* Demi-groupes */}
          <div className="w-1/3 max-w-sm h-[70vh] min-h-[200px] bg-black bg-opacity-70 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-center text-lg font-bold mb-4">
              Demi-groupes
            </h2>
            <div className="space-y-2 flex-grow overflow-auto">
              {/*éléments ici*/}
            </div>
            <button className="mt-4 w-full p-2 btn-default justify-between">
              Ajouter
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ManageGroups;