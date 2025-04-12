import { createContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const Navigate = useNavigate();
  const Location = useLocation();

  return (
    <AuthContext.Provider
      value={{
        Navigate,
        Location,
        Link
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
