import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "../header/header"; // Composant de l'en-tête

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/HomePage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (email === "a@a" && password === "password") {
      handleLogin();
    } else {
      setError("Identifiant ou mot de passe incorrect.");
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
              <label htmlFor="email" className="text-white mb-2">
                Identifiant :
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button
              type="submit"
              className="btn-primary transition duration-300"
            >
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
