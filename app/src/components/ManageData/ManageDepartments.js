import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.js";
import useDepartments from "../../hooks/useDepartments.js";
import useCurriculums from "../../hooks/useCurriculums.js";

const ManageDepartments = () => {
  const {curriculums, error: curriculumError, loading: isCurriculumLoading} = useCurriculums();
  const {departments, loading: isDepartmentLoading, addDepartment} = useDepartments();
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [departmentCurriculums, setDepartmentCurriculums] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/homePage");
  }; 

  const goToManageData = () => {
    navigate("/ManageData");
  }; 

  const handleClickingAddButton = () => {
    setAddingDepartment(true);
  }

  const handleCancelAddingDepartment = () => {
    setDepartmentCurriculums([]);
    setDepartmentName("");
    setAddingDepartment(false);
  }

  const handleAddCurriculum = (curriculum) => {
    if (!departmentCurriculums.some((c) => c.id === curriculum.id)) {
      setDepartmentCurriculums([...departmentCurriculums, curriculum]);
    }
  };

  const handleAddingDepartment = () => {
    if (!departmentName.trim()) {
      setError("Le nom du département est obligatoire.");
      return;
    }
    setError("");
    addDepartment(departmentName, departmentCurriculums);
  }

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
                Départements
              </h2>

              {isDepartmentLoading ? (
                <div className="flex flex-col items-center justify-center  p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[300px] h-max">Chargement des départements...</div>
                </div>
              ) : (
                <>
                  {departments.length === 0 ? (
                    <span className="w-full text-center text-white">Il n'y a pas de départements</span>
                  ) : (
                    <ul className="space-y-4">
                      {departments.map((department) => (
                        <li className="flex items-center bg-white rounded-lg p-2">
                          <div className="text-base text-black w-full flex flex-row ml-2 mr-12">
                            <span className="w-1/3 text-left font-semibold"> {department.name} </span>
                            <span className="w-1/3 text-left"> {department.curriculums.length()} cursus associés </span>
                            <span className="w-1/3 text-left"> {department.users.length()} membres </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="size-6 flex justify-center items-center">
                              <img src="images/pen.svg" alt="Modifier" className="size-6" />
                            </button>
                            <button className="size-6 flex justify-center items-center">
                              <img src="images/trash.svg" alt="Fermer" className="size-6" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button 
                  className="w-[35%] h-7 btn-default py-3 rounded-full flex justify-center items-center space-x-4 px-10 mt-4 mx-auto"
                  onClick={handleClickingAddButton}>
                    <span>Ajouter</span>
                  </button>
                </>
              )}
          </div>

          {addingDepartment && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="tooltip-centered">
                <h2 className="text-xl font-bold mb-4">Ajouter un département</h2>
                <form onSubmit={handleAddingDepartment} className="space-y-2">
                <div>
                  <label className="block mb-1">Nom du département :</label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                    required/>
                </div>
                  {isCurriculumLoading ? (
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                      <div className="spinner"></div>
                      <div className="text-white text-xl font-bold text-center mt-4 max-h-[100px] h-max">
                        Chargement des cursus...
                      </div>
                    </div>
                  ) : (
                    <>
                      {curriculums.length === 0 ? (
                        <span className="w-full text-center">Il n'y a pas de cursus</span>
                      ) : (
                        <div className="space-y-2">
                          <label className="block mb-1">Selectionnez les cursus :</label>
                          <div className="flex flex-wrap gap-2 w-full justify-between">
                            {curriculums.map((curriculum) => (
                              <button
                              key={curriculum.id}
                              type="button"
                              className={`px-4 py-2 rounded-md ${
                                departmentCurriculums.some((c) => c.id === curriculum.id)
                                  ? "bg-primarytint text-white cursor-not-allowed"
                                  : "bg-primary text-white hover:bg-primaryshade"
                              }`}
                              onClick={() => handleAddCurriculum(curriculum)}
                              disabled={departmentCurriculums.some((c) => c.id === curriculum.id)}>
                                {curriculum.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-4">
                    <p className="font-bold">Cursus sélectionnés :</p>
                    <ul className="list-disc list-inside">
                      {departmentCurriculums.length == 0 ? (
                        <li> Auncun cursus selectionné</li>
                      ) : (
                        <>
                          {departmentCurriculums.map((c) => (
                            <li key={c.id}>{c.name}</li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>

                  {error && <p className="text-red-500">{error}</p>}

                  <div className="flex justify-center space-x-2 w-full">
                    <button type="button" onClick={handleCancelAddingDepartment} className="btn-default p-2">
                      Annuler
                    </button>
                    <button type="submit" className="btn-default p-2">
                      Valider
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageDepartments;