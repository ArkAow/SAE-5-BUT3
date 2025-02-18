import React, { useEffect, useState } from "react";
import Node from "./Node";
import Header from "../header/header";
import ControlPanel from "./ControlPanel/ControlPanel";
import Toast from "../Toast/Toast.js";
import useTeachers from "../../hooks/useTeachers.js";
import useSemesters from "../../hooks/useSemesters.js";
import useCourseTypes from "../../hooks/useCourseTypes.js";
import useCourses from "../../hooks/useCourses.js";
import { createPortal } from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation } from "react-router-dom";

const MainGrid = () => {
  const location = useLocation();
  const payload = location.state || {};
  const department = payload.selectedDepartment;
  const groups = payload.selectedGroups;
  const curriculum = payload.selectedCurriculum;

  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [isControlPanelExpanded, setIsControlPanelIsExpanded] = useState(true);

  const { teachers } = useTeachers(setToast, department);

  const { semesters, isLoading: isSemesterLoading, fetchSemesters } = useSemesters(curriculum.id);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const {courseTypes, setCourseTypes, isLoading: isCourseTypeLoading} = useCourseTypes();

  const [isTryingToChangeSemester, setIsTryingToChangeSemester] = useState(false);
  const [pendingSemesterId, setPendingSemesterId] = useState(null);

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) =>
      (group.subGroups || []).map((subGroup) => subGroup.name)
    );
    return ["Tous", ...mainGroups, ...subGroups];
  };

  const {
    items, isLoading: isCoursesLoading, modifiedCourses, deletedCourses, addItem, deleteItem,
    modifItem, moveItem, updateCoursesForRemovedType, setDeletedCourses, setModifiedCourses, setIsLoading: setIsCoursesLoading
  } = useCourses(selectedSubject, teachers, courseTypes, groups, getGroupList());

  const [isLoading, setLoading] = useState(true);
  
  const NodePortal = ({ children }) => {
      return createPortal(children, document.getElementById("portal-root"));
  };

  useEffect(() => {
    if (!isSemesterLoading && semesters.length > 0) {
      const firstSemester = semesters[0];
      setSelectedSemester(firstSemester);
      setSubjects(firstSemester.subjects);
      setSelectedSubject(firstSemester.subjects[0] || null);
    }
  }, [semesters, isSemesterLoading]);

  useEffect(() => {
    if ((semesters || !isSemesterLoading) && !isCourseTypeLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isSemesterLoading, isCourseTypeLoading]);

  const handleTryingToChangeSemester = (e) => {
    const semesterId = parseInt(e.target.value, 10);
    if (modifiedCourses.length > 0 || deletedCourses.length > 0) {
      setPendingSemesterId(semesterId);
      setIsTryingToChangeSemester(true);      
    } else {
      handleSemesterChange(semesterId);
    }
  };
  
  const confirmSemesterChange = async () => {
    if (pendingSemesterId !== null) {
      await handleSemesterChange(pendingSemesterId);
      setPendingSemesterId(null);
    }
    setIsTryingToChangeSemester(false);
  };
  
  const cancelSemesterChange = () => {
    setPendingSemesterId(null);
    setIsTryingToChangeSemester(false);
  };

  const handleSemesterChange = async (semesterId) => {
    const selected = semesters.find((s) => s.id === semesterId);
    if (selected) {
      setSelectedSemester(selected);
      setSubjects(selected.subjects);
      setSelectedSubject(selected.subjects[0] || null);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value, 10);
    const selected = subjects.find((s) => s.id === subjectId);
    setSelectedSubject(selected);
  };

  const goToNextSubject = () => {
    const nextSubjectIndex = subjects.findIndex((s) => s.id === selectedSubject?.id) +
      1;
    if (nextSubjectIndex < subjects.length) {
      const nextSubject = subjects[nextSubjectIndex]; console.log();
      setSelectedSubject(nextSubject);
    }
  }

  const groupList = getGroupList();

  return (
    <>
      <Header />
      <div className={`min-h-screen py-10 cursor-default`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] space-y-10">
            <div className="flex flex-col items-center bg-black bg-opacity-75 p-10 rounded-lg">
              <div className="spinner"></div>
              <div className="text-white text-3xl font-bold mt-4">
                Chargement des données...
              </div>
            </div>
          </div>
        ) : (
          <>
            {isTryingToChangeSemester && (
              <>
                <NodePortal>
                  <div className="fixed inset-0 flex items-center justify-center z-20 text-xs bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-xl w-80 border-2 border-gray-300">
                      <h3 className="text-lg font-bold mb-2 text-center">Avertissement !</h3>
                      <p className="mb-4 text-center">
                        Vous êtes sur le point de changer de semestre.<br/>Toute modification non enregistrée sera perdue.<br/><br/>Voulez-vous continuer ?
                      </p>
                      <div className="flex justify-center space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={cancelSemesterChange}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={confirmSemesterChange}
                          className="px-4 py-2 btn-default w-full">
                          Continuer
                        </button>
                      </div>
                    </div>
                  </div>
                </NodePortal>
              </>
            )}
            {toast.visible && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, visible: false })}
              />
            )}
            <div className="flex items-center justify-start gap-5 h-20 px-10">
              <div className="absolute top-6">
                <ControlPanel
                  setToast={setToast}
                  isExpanded={isControlPanelExpanded}
                  setIsExpanded={setIsControlPanelIsExpanded}

                  curriculum={curriculum}

                  fetchSemesters={fetchSemesters}
                  selectedSemester={selectedSemester}

                  teachers={teachers}

                  groups={groups}
                  groupList={groupList}

                  courseTypes={courseTypes}
                  setCourseTypes={setCourseTypes}
                  updateCoursesForRemovedType={updateCoursesForRemovedType}

                  addItem={addItem}
                  modifiedCourses={modifiedCourses}
                  setModifiedCourses={setModifiedCourses}
                  deletedCourses={deletedCourses}
                  setDeletedCourses={setDeletedCourses}

                  isSaving={isCoursesLoading}
                  setSaving={setIsCoursesLoading}
                />
              </div>

              {/* Choix du semestre selon le curriculum */}
              <select
                className="w-fit min-w-28 max-w-60 h-10 mt-2 ml-24 px-2 before:px-4 py-2 default-select rounded-full font-normal"
                value={selectedSemester?.id || ""}
                onChange={handleTryingToChangeSemester}>
                <option value="" disabled>
                  Choisir un semestre
                </option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>

              {/* Choix des matières selon le semestre */}
              <select
                className="w-fit min-w-28 max-w-60 h-10 mt-2 px-2 before:px-4 py-2 default-select rounded-full font-normal"
                value={selectedSubject?.id || ""}
                onChange={handleSubjectChange}>
                <option value="" disabled>
                  Choisir une matière
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              {/* Bouton suivant */}
              <button
                onClick={() => {
                  goToNextSubject();
                }}
                disabled={
                  !selectedSubject ||
                  subjects.indexOf(selectedSubject) >=
                    subjects.length - 1
                }
                className={`flex w-48 h-10 mt-2 items-center px-4 py-2 text-white bg-primary rounded-full
                  shadow-md hover:bg-primaryshade focus:bg-primarytint border border-white focus:outline-none
                  ${
                    !selectedSubject ||
                    subjects.indexOf(selectedSubject) >=
                      subjects.length - 1
                      ? "bg-primaryshade cursor-not-allowed"
                      : ""
                  }`}>
                Passer au suivant
                <img
                  src="/images/right-arrow.svg"
                  alt="Right Arrow"
                  className="ml-2 w-4 h-4"/>
              </button>
            </div>

            {isCoursesLoading ? (
              <div className="flex items-center justify-center w-full mt-10">
                <div className="flex flex-col items-center bg-black bg-opacity-75 p-10 rounded-lg">
                  <div className="spinner"></div>
                  <div className="text-white text-3xl font-bold mt-4">
                    Chargement des cours...
                  </div>
                </div>
              </div>
            ) : (
              <>
                {groups.length === 0 ? (
                  <div className="flex items-center justify-center w-full">
                    <div className="w-2/3 text-center text-primary mt-16 text-lg font-bold p-2 bg-white rounded-full">
                      Il y a un problème de groupes, veuillez en ajouter pour consulter le tableau.
                    </div>
                  </div>
                ) : (
                  <DndProvider backend={HTML5Backend}>
                    <div className={`${isControlPanelExpanded ? "ml-36 max-w-[85vw]" : "ml-10 max-w-[93vw]"}
                    mt-8 rounded-lg overflow-auto max-h-[71vh] min-h-[25rem] -z-10 transform duration-500`}>
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `40px repeat(${groupList.length}, minmax(5rem, 1fr))`,
                        }}>
                        <div className="w-10 h-6"></div>
                        {groupList.map((groupName, colIndex) => (
                          <div
                            key={`col-label-${colIndex}`}
                            className="w-full h-6 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                            {groupName}
                          </div>
                        ))}
                        {Array.from(
                          { length: selectedSemester.week_duration || 20 }, // La durée par défaut est 20 si week_duration est indéfini
                          (_, i) => (selectedSemester.week_start || 1) + i // La semaine de départ par défaut est 1 si week_start est indéfini
                        ).map((week, rowIndex) => (
                          <React.Fragment key={`row-${rowIndex}`}>
                            <div className={`h-20 w-10 bg-gray-200 flex items-center justify-center text-black text-sm font-bold`}>
                              S{week}
                            </div>
                            {groupList.map((_, colIndex) => {
                              const positionKey = `${rowIndex}-${colIndex}`;
                              const cellItems = items[positionKey] || [];
                              return (
                                <Node
                                  key={positionKey}
                                  positionKey={positionKey}
                                  items={cellItems}
                                  courseTypes={courseTypes}
                                  teachers={teachers}
                                  moveItem={moveItem}
                                  deleteItem={deleteItem}
                                  modifItem={modifItem}
                                />
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </DndProvider>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MainGrid;