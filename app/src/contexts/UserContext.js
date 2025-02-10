import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [departments, setDepartments] = useState([]);

  return (
    <UserContext.Provider value={{ fullName, setFullName, email, setEmail, departments, setDepartments }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);