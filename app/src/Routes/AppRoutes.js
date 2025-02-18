import React, { useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../components/Login/Login";
import HomePage from "../components/homePage/homePage";
import PreGridEdit from "../components/MainGridEdit/PreGridEdit";
import SeePrevi from "../components/SeePrevi/SeePrevi";
import InsertM3C from "../components/ManageData/InsertM3C";
import ManageData from "../components/ManageData/ManageData";
import ManageDepartments from  "../components/ManageData/ManageDepartments";
import ManageUsers from  "../components/ManageData/ManageUsers";
import ManageTeachers from "../components/ManageData/ManageTeachers";
import ProtectedRoute from "./ProtectedRoutes";
import Statistics from "../components/statistics/Statistics";
import ManageGroups from "../components/ManageData/ManageGroups";
import MainGrid from "../components/MainGridEdit/MainGrid";

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
              <MainGrid />
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
          path="/ManageData"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManageData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageTeachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManageTeachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageGroups"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManageGroups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageDepartments"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageUsers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManageUsers />
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
        <Route
          path="/PreGridEdit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PreGridEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Statistics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
