import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Client/home/index.jsx";

export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  );
}
