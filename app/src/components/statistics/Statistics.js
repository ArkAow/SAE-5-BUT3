import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import routes from "../../Routes/routes";

const Statistics = ({ selectedSemester, selectedSubject, groups, teachers }) => {
  const [category, setCategory] = useState("Groupe");
  const [selected, setSelected] = useState(groups[0].name);
  const [hoursData, setHoursData] = useState([]);
  const [timeConstraint, setTimeConstraint] = useState(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [totalHoursData, setTotalHoursData] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const subGroups = groups.flatMap(group => group.subGroups || []);
  const options = category === "Groupe" ? groups : teachers;

  useEffect(() => {
    if (category === "Groupe") {
      fetchTotalHoursForGroups();
    }
  }, [groups]);

  useEffect(() => {
    if (category === "Enseignant") {
      const teacher = teachers.find((t) => t.code === selected);
      if (teacher) {
        fetchHoursForTeacher(teacher.id);
        setTimeConstraint(teacher.timeConstraints);
      }
    } else if (category === "Groupe") {
      const halfGroup = subGroups.find(sg => sg.name === selected);
      if (halfGroup) fetchHoursForHalfGroup(halfGroup.id);
    }
  }, [category, selected, selectedSubject, showAllSubjects]);

  const fetchHoursForTeacher = async (teacherId) => {
    try {
      setIsLoading(true);
      console.log(`Chargement des statistiques pour l'enseignant ID: ${teacherId}...`);
      const response = await fetch(routes.dev.statistics.getCoursesForTeacher(teacherId));
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");
      const data = await response.json();
      const formattedData = transformData(data);
      setHoursData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHoursForHalfGroup = async (halfGroupId) => {
    try {
      setIsLoading(true);
      console.log(`Chargement des statistiques pour le demi-groupe ID: ${halfGroupId}...`);
      const response = await fetch(routes.dev.statistics.getCoursesForHalfGroup(halfGroupId));
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");
      const data = await response.json();
      const formattedData = transformData(data);
      setHoursData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalHoursForGroups = async () => {
    try {
      const totals = await Promise.all(
        subGroups.map(async (sg) => {
          const response = await fetch(routes.dev.statistics.getCoursesForHalfGroup(sg.id));
          if (!response.ok) return { name: sg.name, total: 0 };

          const data = await response.json();
          const total = Object.values(data).reduce((acc, weekData) => {
            return acc + Object.values(weekData).reduce((sum, subjectData) => {
              return sum + Object.values(subjectData).reduce((subSum, typeData) => {
                return subSum + (typeData.total_duration || 0);
              }, 0);
            }, 0);
          }, 0);
          return { name: sg.name, total };
        })
      );
      setTotalHoursData(totals);
      const uniqueTotals = [...new Set(totals.map(t => t.total))];
      setShowWarning(uniqueTotals.length > 1);
    } catch (error) {
      console.error("Erreur lors du chargement des heures totales :", error);
    }
  };

  const transformData = (rawData) => {
    const weekStart = selectedSemester.week_start || 1;
    const weekDuration = selectedSemester.week_duration || 20;

    let transformed = Array.from({ length: weekDuration }, (_, i) => ({
      week: weekStart + i,
      CM: 0,
      TD: 0,
      TP: 0,
      SAE: 0,
    }));

    Object.entries(rawData).forEach(([week, subjects]) => {
      const weekIndex = parseInt(week) - weekStart;
      if (weekIndex >= 0 && weekIndex < weekDuration) {
        Object.entries(subjects).forEach(([subjectName, subjectData]) => {
          if (showAllSubjects || subjectName === selectedSubject.name) {
            Object.entries(subjectData).forEach(([type, details]) => {
              if (transformed[weekIndex][type] !== undefined) {
                transformed[weekIndex][type] += details.total_duration || 0;
              }
            });
          }
        });
      }
    });

    return transformed;
  };

  return (
    <div className="min-h-max flex flex-col items-left ml-10 pt-6">
      <div className="flex flex-row justify-between w-full max-w-[90vw] mt-2">
        <div className="h-[65vh] w-[65vw] min-w-[40rem] rounded-lg bg-white shadow-lg p-4">
          <div className="flex items-center relative mb-4">
            <div className="relative z-10">
              <select
                className="border border-black rounded-full px-1 py-1 text-sm text-black bg-white cursor-pointer"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelected(options[0].name || options[0].code)}}
                value={category}>
                <option value="Groupe">Groupes</option>
                <option value="Enseignant">Enseignants</option>
              </select>
            </div>

            <div className="absolute left-[50px] pl-4">
              <select
                className="bg-primary text-xs text-white rounded-full pl-10 px-2 py-1 cursor-pointer"
                onChange={(e) => setSelected(e.target.value)}
                value={selected}>
                {category === "Groupe"
                  ? subGroups.map((sg) => (
                    <option key={sg.id} value={sg.name}>{sg.name}</option>))
                  : teachers.map((t) => (
                    <option key={t.id} value={t.code}>{t.code}</option>))
                }
              </select>
            </div>
            <button
              className={`absolute left-[150px] pl-4 ml-4 px-4 py-1 text-white text-sm rounded-full 
                ${showAllSubjects ? "bg-primaryshade border-2 border-primarytint" : "bg-primary"}`}
              onClick={() => setShowAllSubjects(!showAllSubjects)}>
              Toutes les matières
            </button>
            <p className="absolute left-[340px] font-bold">Graphique des heures par {category === 'Groupe' ? 'groupes' : 'enseignants'}, par semaines :</p>
          </div>

          {hoursData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hoursData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" label={{ value: "Numéro de la semaine", position: "bottom" }} />
                <YAxis domain={[0, 40]} label={{ value: "Nombre d'heures", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="CM" stackId="a" fill="#FFFF00" name="CM (Cours Magistraux)" />
                <Bar dataKey="TD" stackId="a" fill="#FF3131" name="TD (Travaux Dirigés)" />
                <Bar dataKey="TP" stackId="a" fill="#38B6FF" name="TP (Travaux Pratiques)" />
                <Bar dataKey="SAE" stackId="a" fill="#57B440" name="SAE (Situation d’Apprentissage et d’Évaluation)" />
                {timeConstraint && (
                  <ReferenceLine y={timeConstraint} stroke="red" strokeDasharray="3 3" />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : isLoading ? (
            <p className="text-center mt-10 text-gray-500">Chargement</p>
          ) : (
            <p className="text-center mt-10 text-gray-500">Sélectionnez un enseignant pour voir les statistiques</p>
          )}
        </div>

        <div className="flex flex-col justify-start gap-3 items-left ml-6 relative">
          <div className="h-[24v] w-full rounded-lg bg-white shadow-lg px-4 flex flex-col justify-start">
            <p className="font-bold my-2">Légende du graphique :</p>
            <div className="flex items-center mb-2 text-xs">
              <div className="w-4 h-4 bg-[#FFFF00] mr-2"></div> <span>CM (Cours Magistraux)</span>
            </div>
            <div className="flex items-center mb-2 text-xs">
              <div className="w-4 h-4 bg-[#FF3131] mr-2"></div> <span>TD (Travaux Dirigés)</span>
            </div>
            <div className="flex items-center mb-2 text-xs">
              <div className="w-4 h-4 bg-[#38B6FF] mr-2"></div> <span>TP (Travaux Pratiques)</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-[#57B440] mr-2"></div> <span>SAE (Situation d’Apprentissage et d’Évaluation)</span>
            </div>
          </div>

          <div className="flex flex-col h-fit w-full min-w-64 justify-start rounded-lg shadow-lg bg-white items-left relative">
            <div className="h-2/3 w-full px-4 justify-center mt-2">
              <p className="font-bold mb-2 text-center">Répartition des heures parmis les groupes:</p>
              {totalHoursData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={totalHoursData}>
                    <YAxis type="number" hide />
                    <XAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" name="Total heures" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-gray-500 text-center">Chargement...</p>
              )}
            </div>

            {/* Alerte si inégalités */}
            {showWarning && (
              <div className="m-2 p-2 text-xs text-red-600 bg-red-100 border border-red-400 rounded">
                ⚠️ Les demi-groupes n'ont pas tous le même nombre d'heures !
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
