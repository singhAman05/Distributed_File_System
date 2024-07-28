import axios from "axios";
import { BackendUrl, ProfileRoute } from "utils/config";
const API_URL = `${BackendUrl}/${ProfileRoute}`;

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
