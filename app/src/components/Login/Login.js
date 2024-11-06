import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../header/header.js'; // Pour le style de base si nécessaire
import './login.css'; // Pour le style de base si nécessaire

const Login = ({ setIsAuthenticated }) => {  // Passe setIsAuthenticated par props pour la gestion globale de l'authentification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    // Action à réaliser si l'authentification réussit
    setIsAuthenticated(true); 
    navigate('/MainPreviEdit'); // Redirige vers la page principale
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple pour vérifier que les champs ne sont pas vides
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Logique de connexion (exemple simple)
    if (email === "a@a" && password === "password") {
      handleLogin(); // Appelle handleLogin si les identifiants sont corrects
    } else {
      setError("Identifiant ou mot de passe incorrect.");
    }
  };

  return (
    <>
      <div className="body-container">
        <div className="login-header">
          <LoginHeader />
        </div>
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <div className="profile-image">
              {/* Ajoute une image de profil ici si nécessaire */}
            </div>
            <div className="form-group">
              <label htmlFor="email">Identifiant :</label>
              <input
                type="email"
                id="identifiant"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Se connecter</button>
            <p className="error" style={{visibility: error ? "visible" : "hidden" }}>
              {error}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
