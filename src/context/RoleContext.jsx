import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("Student");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook
export const useRole = () => useContext(RoleContext);
