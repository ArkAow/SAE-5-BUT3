import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useSubjects = (semesterId = null, departmentId = null) => {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchSubjectsForSemester = async () => {
      try {
        setIsLoading(true);
        console.log(`Chargement des matières...`);
        const response = await fetch(routes.dev.subjects.getFromSemester(semesterId));
        if (!response.ok) throw new Error("Erreur lors du chargement des matières");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        console.log(`Chargement des matières réussi`);
      }
    };

    const fetchSubjectsForDepartment = async () => {
      try {
        setIsLoading(true);
        console.log(`Chargement des matières...`);
        const response = await fetch(routes.dev.subjects.getFromDepartment(departmentId));
        if (!response.ok) throw new Error("Erreur lors du chargement des matières");
        const data = await response.json();
        const subjects = data.flatMap(curriculum => curriculum.semesters.flatMap(semester => semester.subjects));
        setSubjects(subjects);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        console.log(`Chargement des matières réussi`);
      }
    };

    const fetchSubjects = async () => {
      if (semesterId) {
        await fetchSubjectsForSemester();
        return;
      }
      if (departmentId) {
        await fetchSubjectsForDepartment();
        return;
      }
    }

    useEffect(() => {
      fetchSubjects();
    }, [semesterId, departmentId]);
  
    return { subjects, error, isLoading, fetchSubjects };
  };
export default useSubjects;