import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useCurriculums = () => {
    const [curriculums, setCurriculums] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchCurriculums = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(routes.dev.curriculums.getCurriculums());
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des curriculums");
          }
          const data = await response.json();
          setCurriculums(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchCurriculums();
    }, []);
  
    return { curriculums, error, isLoading };
  };
export default useCurriculums;