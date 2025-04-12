import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./assets/components/Dashboard";
import DetailView from "./assets/components/DetailView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/:timestamp" element={<DetailView />} />
    </Routes>
  );
}

export default App;
