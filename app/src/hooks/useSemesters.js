import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useSemesters = (curriculumId) => {
    const [semesters, setSemesters] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchSemesters = async () => {
      try {
        setIsLoading(true);
        console.log(`Chargement des semestres...`);
        const response = await fetch(routes.dev.semesters.get(curriculumId));
        if (!response.ok) throw new Error("Erreur lors du chargement des semestres");
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        console.log(`Chargement des semestres réussi`);
      }
    };

    useEffect(() => {
      fetchSemesters();
    }, [curriculumId]);
  
    return { semesters, error, isLoading, fetchSemesters };
  };
export default useSemesters;