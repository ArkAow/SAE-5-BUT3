import React, { useState } from "react";
import LoginHeader from './header.js'; // Pour ajouter un style de base si nécessaire
import './login.css'; // Pour ajouter un style de base si nécessaire

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple pour vérifier que les champs ne sont pas vides
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Logique de connexion (exemple)
    if (email === "admin@example.com" && password === "password") {
      alert("Connexion réussie !");
      setError("");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <>
  
    <div className="body-container">
      <div className="login-header"><LoginHeader />
      </div>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="profile-image"></div>
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
          <p className="error" style={{visibility: error ? "visible" : "hidden"}}>
            {error}
          </p> 
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
