import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import PasswordResetPage from "pages/PasswordResetPage";
import DashboardPage from "pages/DashboardPage";
import { Toaster } from "sonner";

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/login":
        document.title = "Login";
        break;
      case "/register":
        document.title = "Register";
        break;
      case "/forgot-password":
        document.title = "Forgot Password";
        break;
      case "/reset-password":
        document.title = "Reset Password";
        break;
      case "/dashboard":
        document.title = "Dashboard";
        break;
      default:
        document.title = "D-F-S"; // Default title
    }
  }, [location]);

  return null; // This component does not render anything
};

function App() {
  return (
    <Router>
      <Toaster />
      {/* This component dynamically changes the title */}
      <DynamicTitle />

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
