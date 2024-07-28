// src/services/fileService.js
import axios from "axios";
import { handleResponse } from "utils/responseHandler";
import { BackendUrl, FileRoute } from "utils/config";

const API_URL = `${BackendUrl}/${FileRoute}`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

export const uploadFile = async (file, onProgress, signal) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      },
      signal: signal, // Pass the abort signal here
    });
    return response.data;
  } catch (error) {
    console.log(error);
    const handledError = handleResponse(error);
    throw handledError; // Throw the handled error
  }
};

export const listFiles = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/listFiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const downloadFile = async (fileId) => {
  try {
    const token = getToken();
    console.log(token);
    const response = await axios.get(`${API_URL}/download/${fileId}`, {
      responseType: "blob", // Important for file download
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    // Create a URL for the downloaded file
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: response.headers["content-type"] })
    );
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : `downloaded_file_${fileId}`;

    link.setAttribute("download", filename.replace(/['"]/g, ""));
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
