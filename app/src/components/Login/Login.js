import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "../header/header";
import { useUser } from "../../contexts/UserContext"; // Import du UserContext

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState(""); // Champ "username"
  const [password, setPassword] = useState(""); // Champ "password"
  const [error, setError] = useState(""); // Gestion des erreurs
  const [loading, setLoading] = useState(false); // Gestion du chargement
  const { setFullName } = useUser(); // Récupère la fonction setFullName depuis le UserContext

  const navigate = useNavigate();

  // Efface l'erreur lorsqu'on modifie un champ
  useEffect(() => {
    setError("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true); // Active le chargement

    try {
      const response = await fetch("http://localhost:8600/ldap/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Envoi des cookies/session
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const givenName = data.data[0]?.givenName || "Prénom inconnu";
        const sn = data.data[0]?.sn || "Nom inconnu";
        const fullName = `${givenName} ${sn}`;

        setFullName(fullName); // Mise à jour du nom
        setIsAuthenticated(true); // Met à jour l'état d'authentification
        navigate("/homePage"); // Redirection
      } else {
        setError(data.message || "Identifiant ou mot de passe incorrect.");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false); // Désactive le chargement
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <LoginHeader />
      <div className="flex items-center w-1/2 justify-center max-w-[60%] mx-auto mt-20 bg-[rgba(0,0,0,0.7)] rounded-2xl shadow-lg p-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <div className="bg-primary rounded-full w-32 h-32 mb-12 bg-center bg-cover bg-pfp" />

          <div className="flex flex-col items-center mb-6">
            <label htmlFor="username" className="text-white mb-2">
              Identifiant :
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-[130%] px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col items-center mb-6">
            <label htmlFor="password" className="text-white mb-2">
              Mot de passe :
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-[130%] px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="btn-login transition duration-300"
            disabled={loading} // Désactive le bouton si en chargement
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {error && (
            <p className="text-red-500 text-right text-sm mt-4 h-6">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
