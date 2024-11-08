import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login/Login';
import HomePage from '../components/homePage/homePage';
import MainPreviEdit from '../components/MainGridEdit/MainPreviEdit';
import ProtectedRoute from './ProtectedRoutes';

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Gestion de l’authentification

  return (
    <Router>
      <Routes>
        {/* Route de Connexion */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/homePage" replace /> // Redirige vers HomePage si authentifié
              : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />

        {/* Page d’Accueil (protégée) */}
        <Route 
          path="/homePage" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />

        {/* Page MainPreviEdit (protégée) */}
        <Route
          path="/MainPreviEdit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainPreviEdit />
            </ProtectedRoute>
          }
        />

        {/* Route Inconnue (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
