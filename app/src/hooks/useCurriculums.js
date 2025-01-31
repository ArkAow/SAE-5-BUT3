import { useState, useEffect } from "react";

const useCurriculums = (url) => {
    const [curriculums, setCurriculums] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCurriculums = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des curriculums");
          }
          const data = await response.json();
          setCurriculums(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCurriculums();
    }, [url]);
  
    return { curriculums, error, loading };
  };
export default useCurriculums;