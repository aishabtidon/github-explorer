import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import Repo from "./pages/Repo.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* user details page: /user/:username */}
      <Route path="/user/:username" element={<User />} />
      {/* repo details page: /repo/:owner/:name */}
      <Route path="/repo/:owner/:name" element={<Repo />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
