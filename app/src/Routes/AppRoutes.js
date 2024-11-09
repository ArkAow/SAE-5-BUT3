import React, { useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../components/Login/Login";
import HomePage from "../components/homePage/homePage";
import MainPreviEdit from "../components/MainGridEdit/MainPreviEdit";
import ProtectedRoute from "./ProtectedRoutes";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/homePage" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/homePage"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MainPreviEdit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainPreviEdit />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
