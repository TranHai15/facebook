import { createContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { decodeData } from "../../utils/function";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const Navigate = useNavigate();
  const Location = useLocation();
  const accessToken = localStorage.getItem("accessToken") ?? null;
  let role = null;
  if (accessToken != null) {
    const dataUser = decodeData(accessToken);
    role = dataUser?.is_admin;
  }
  const [user, setUser] = useState({ role: role });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        Navigate,
        Location,
        Link,
        setUser,
        user,
        setIsLoading,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
