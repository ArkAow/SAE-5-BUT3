import { useState, useEffect } from "react";
import routes from "../Routes/routes";

const useCourseTypes = () => {
    const [courseTypes, setCourseTypes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
  const fetchCourseTypes = async () => {
    try {
      const response = await fetch(routes.dev.courseTypes.get());
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des types de cours.");
      }
      const data = await response.json();
      setCourseTypes(data);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseTypes();
  }, []);
  
    return { courseTypes, error, isLoading, fetchCourseTypes };
  };
export default useCourseTypes;