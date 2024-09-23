import React, { useState } from "react";
import './Login.css'; // Pour ajouter un style de base si nécessaire

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
    if (email === "admin@example.com" && password === "password123") {
      alert("Connexion réussie !");
      setError("");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
