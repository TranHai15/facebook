import React, { Children, useContext } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import { Navigate } from "react-router-dom";
export default function AdminRouter({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (user?.role !== 1) return <Navigate to="/" replace />;

  return children;
}
