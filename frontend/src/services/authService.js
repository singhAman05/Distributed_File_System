import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/v1";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

// New functions for password reset
export const sendPasswordResetEmail = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email,
  });
  return response.data;
};

export const resetPassword = async (userId, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, {
    userId,
    newPassword,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};