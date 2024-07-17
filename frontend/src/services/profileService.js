import axios from "axios";

const API_URL = "http://localhost:5000/api/profile/v1";

export const getProfile = async () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  console.log(token);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/me`, config);
  console.log(response);
  return response.data;
};
