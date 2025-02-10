import React, { useState, useEffect } from "react";
import Header from "../header/header";
import routes from "../../Routes/routes";
import useUsers from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext"; // Import du UserContext

const Login = ({ setIsAuthenticated }) => {
  const { getUserByEmail, updateUser } = useUsers();
  const [username, setUsername] = useState(""); // Champ "username"
  const [password, setPassword] = useState(""); // Champ "password"
  const [error, setError] = useState(""); // Gestion des erreurs
  const [loading, setLoading] = useState(false); // Gestion du chargement
  const { setFullName, setEmail, setDepartments } = useUserContext(); // Récupère la fonction setFullName depuis le UserContext

  const navigate = useNavigate();

  // Efface l'erreur lorsqu'on modifie un champ
  useEffect(() => {
    setError("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialisation des erreurs
  
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(routes.dev.ldap.login(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
  
      const data = await response.json();
      if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
        setError("Identifiant ou mot de passe incorrect.");
        return;
      }
  
      const { surname = "Unknown", name = "Unknown", email = null } = data.data[0];
      // Si l'utilisateur n'est pas "admin root", on vérifie l'email
      if (!(surname === "admin" && name === "root")) { // /!\ A SECURISER
        if (!email) {
          setError("Aucune adresse email trouvée pour ce compte.");
          return;
        }
  
        const logingInUser = await getUserByEmail(email);
        if (!logingInUser) {
          setError("Compte non autorisé.");
          return;
        }

        //si c'est la première connexion de l'utilisateur -> mettre à jour le nom
        if (logingInUser.fullname === "") {
          logingInUser.fullname = `${surname} ${name}`;
          updateUser(logingInUser);
        }
        // Mise à jour du userContext
        setEmail(logingInUser.email);
        setFullName(logingInUser.fullname);
        setDepartments(logingInUser.departments || []);
      } else {
        setEmail(`admin@root`);
        setFullName(`Administrateur`);
        setDepartments([]);
      }
  
      // Connexion réussie
      setIsAuthenticated(true);
      navigate("/homePage");
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="flex items-center w-[400px] h-[600px] justify-center mx-auto mt-20 bg-[rgba(0,0,0,0.7)] rounded-2xl shadow-lg p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <div className="bg-primary rounded-full size-24 mb-16 bg-center bg-cover bg-pfp" />

          <div className="flex flex-col w-3/4 items-start mb-6">
            <label htmlFor="username" className="text-white mb-2">
              Identifiant
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col w-3/4 items-start mb-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="btn-login"
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
