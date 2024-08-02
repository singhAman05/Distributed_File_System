// src/hooks/useAuth.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(user.token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [navigate]);
};

export default useAuth;
