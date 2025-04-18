import React, { useContext } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthRouter({ children }) {
  const { user } = useContext(AuthContext);
  if (user?.role !== null || user?.role == 0 || user?.role == 1)
    return <Navigate to="/" replace />;

  return children;
}
