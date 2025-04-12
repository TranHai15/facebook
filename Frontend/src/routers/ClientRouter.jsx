import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "@contexts/Auth/AuthContext.jsx";

export default function ClientRouter({ children }) {
  const { user } = useContext(AuthContext);
  if (user?.role == null) return <Navigate to="/login" replace />;
  return children;
}
