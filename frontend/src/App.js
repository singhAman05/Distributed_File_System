import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import PasswordResetPage from "pages/PasswordResetPage";
import DashboardPage from "pages/DashboardPage";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<PasswordResetPage />} />
        <Route path="/*" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
