import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../components/Login/Login'; // La page de login
import MainPreviEdit from '../components/MainGridEdit/MainPreviEdit'; // La page principale
import ProtectedRoute from './ProtectedRoutes'; // Composant pour les routes protégées

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour l'authentification

  return (
    <Router>
      <Routes>
        {/* Route pour la page de login */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Route protégée pour la page d'accueil */}
        <Route
          path="/MainPreviEdit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPreviEdit /> 
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
