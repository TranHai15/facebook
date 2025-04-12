import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Client/home/index.jsx";

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  );
}
