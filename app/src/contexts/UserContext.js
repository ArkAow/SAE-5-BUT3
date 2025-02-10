import React, { createContext, useState, useContext } from "react";

// Créer le contexte
const UserContext = createContext();

// Fournisseur du contexte
export const UserProvider = ({ children }) => {
  const [fullName, setFullName] = useState(""); // Stocke fullName

  return (
    <UserContext.Provider value={{ fullName, setFullName }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useUserContext = () => useContext(UserContext);
