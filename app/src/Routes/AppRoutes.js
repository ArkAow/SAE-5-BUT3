import React, { useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../components/Login/Login";
import HomePage from "../components/homePage/homePage";
import PreviEdit from "../components/MainGridEdit/PreviEdit";
import SeePrevi from "../components/SeePrevi/SeePrevi";
import InsertM3C from "../components/InsertM3C/InsertM3C";
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
          path="/PreviEdit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PreviEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SeePrevi"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SeePrevi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InsertM3C"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InsertM3C />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
