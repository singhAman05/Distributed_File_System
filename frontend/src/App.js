import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import PasswordResetPage from "pages/PasswordResetPage";
import DashboardPage from "pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<PasswordResetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
