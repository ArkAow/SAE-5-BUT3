import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Node from "./Node";
import ControlPanel from "./ControlPanel/ControlPanel";

const MainGrid = ({curriculum}) => {

  const [items, setItems] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedCourseType, setSelectedCourseType] = useState({ name: "CM", color: "#FFD700" });
  const [selectedTeacher, setSelectedTeacher,] = useState("");
  const [selectedDuration, setSelectedDuration,] = useState(1.0);
  const [groups, setGroups] = useState(curriculum.group);

  const addGroups = (newGroups) => {
    setGroups((prevGroups) => {
      const existingGroupNames = prevGroups.map((g) => g.name);
      const filteredNewGroups = newGroups.filter(
        (newGroup) => !existingGroupNames.includes(newGroup.name)
      );
      return [...prevGroups, ...filteredNewGroups];
    });
  };

  const addItem = () => {
    const positionKey = `${selectedRow}-${selectedCol}`;
    const newItem = { 
      color: selectedCourseType.color,
      courseType: selectedCourseType.name,
      teacher: selectedTeacher,
      duration: selectedDuration,
      id: Date.now()
    };
    setItems((prevItems) => ({
      ...prevItems,
      [positionKey]: [...(prevItems[positionKey] || []), newItem],
    }));
  };

  const getGroupList = () => {
    const mainGroups = groups.map((group) => group.name);
    const subGroups = groups.flatMap((group) => group.subGroups);
    return ["Tous", ...mainGroups, ...subGroups];
  };

  const moveItem = (fromKey, toKey) => {
    setItems((prevItems) => {
      const fromItems = [...(prevItems[fromKey] || [])];
      const toItems = [...(prevItems[toKey] || [])];
      if (fromItems.length === 0) return prevItems;
      const draggedItem = fromItems.pop();
      return {
        ...prevItems,
        [fromKey]: fromItems,
        [toKey]: [...toItems, draggedItem],
      };
    });
  };

  const GRID_ROW_LENGTH = 25;
  const groupList = getGroupList();

  return (
    <div className="min-h-screen py-10">
      <div className="flex items-center justify-start gap-5 h-20 px-10">
        <div className="absolute top-6">
          <ControlPanel
            groups={groups}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            selectedCol={selectedCol}
            setSelectedCol={setSelectedCol}
            selectedCourseType={selectedCourseType}
            setSelectedCourseType={setSelectedCourseType}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            addItem={addItem}
            addGroups={addGroups}
          />
        </div>

        <button className="flex min-w-fit h-10 ml-24 mt-2 items-center px-4 py-2 text-white
          bg-primary rounded-full shadow-md hover:bg-primaryshade focus:bg-primarytint
          border border-white focus:outline-none">
          Passer au suivant
          <img
            src="/images/right-arrow.svg"
            alt="Right Arrow"
            className="ml-2 w-4 h-4"/>
        </button>

        <select className="w-fit h-10 mt-2 px-4 py-2 default-select rounded-full font-normal">
          <option value="" disabled selected>
            Sélectionnez une ressource
          </option>
          {curriculum.ressources.map((ressource) => (
            <option key={ressource} value={ressource}>
              {ressource}
            </option>
          ))}
        </select>
      </div>

      {groups.length === 0 ? (
        <div className="flex items-center justify-center w-full">
          <div className="w-1/2 text-center text-primary mt-10 text-lg font-bold p-2 bg-white rounded-full">
            Il n'y a pas de groupes, veuillez en ajouter pour consulter le tableau.
          </div>
        </div>

      ) : (
      
        <DndProvider backend={HTML5Backend}>
          <div className="ml-36 rounded-lg overflow-auto max-h-[75vh] min-h-[25rem] max-w-[85vw] -z-10">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `40px repeat(${groupList.length}, minmax(5rem, 1fr))`,
              }}>
              <div className="w-10 h-6"></div>
              {groupList.map((groupName, colIndex) => (
                <div
                  key={`col-label-${colIndex}`}
                  className={`w-full h-6 bg-gray-200 flex items-center justify-center text-black text-sm font-bold`}>
                  {groupName}
                </div>
              ))}
              {Array.from({ length: GRID_ROW_LENGTH }).map((_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <div className="h-20 w-10 bg-gray-200 flex items-center justify-center text-black text-sm font-bold">
                    S{rowIndex + 1}
                  </div>
                  {groupList.map((_, colIndex) => {
                    const positionKey = `${rowIndex}-${colIndex}`;
                    const cellItems = items[positionKey] || [];
                    return (
                      <Node
                        key={positionKey}
                        positionKey={positionKey}
                        items={cellItems}
                        moveItem={moveItem}/>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </DndProvider>
      )}
    </div>
  );
};

export default MainGrid;
