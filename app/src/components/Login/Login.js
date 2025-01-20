import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "../header/header";
import { useUser } from "../../contexts/UserContext"; // Import du UserContext

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState(""); // Le champ "username"
  const [password, setPassword] = useState(""); // Le champ "password"
  const [error, setError] = useState(""); // Pour afficher les erreurs
  const { setFullName } = useUser(); // Récupère la fonction setFullName depuis le UserContext

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const url = `http://localhost:8600/ldap/login?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // Récupération directe des valeurs "givenName" et "sn"
        const givenName = data.data[0]?.givenName || "Prénom inconnu";
        const sn = data.data[0]?.sn || "Nom inconnu";

        // Combinaison des deux champs pour le nom complet
        const fullName = `${givenName} ${sn}`;

        setFullName(fullName); // Mise à jour de l'état du nom complet
        setIsAuthenticated(true); // Mettre à jour l'état d'authentification

        navigate("/homePage"); // Redirection vers la page d'accueil après la connexion
      } else {
        setError(data.message || "Identifiant ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-landscape flex flex-col items-center">
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
                className="w-[130%] px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="btn-login transition duration-300">
              Se connecter
            </button>
            <p
              className={`text-red-500 text-right text-sm mt-4 h-6 ${
                error ? "visible" : "invisible"
              }`}
            >
              {error}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
