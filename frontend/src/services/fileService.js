// src/services/fileService.js
import axios from "axios";

export const uploadFile = async (file, onProgress, signal) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/files/v1/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        },
        signal: signal, // Pass the abort signal here
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Upload canceled:", error.message);
    } else if (error.response) {
      // The request was made and the server responded with a status code
      console.error(
        "Server responded with status code:",
        error.response.status
      );
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};
