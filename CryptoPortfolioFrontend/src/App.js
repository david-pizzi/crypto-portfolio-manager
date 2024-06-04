// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CryptoDashboard from "./components/CryptoDashboard";
import Profile from "./components/Profile";
import Portfolio from './components/Portfolio';
import AppLayout from "./components/AppLayout";

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<CryptoDashboard />} />
          <Route path="/" element={<CryptoDashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
