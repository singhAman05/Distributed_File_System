// src/utils/errorHandler.js
import { logoutUser } from "../redux/auth/authSlice";
import { store } from "../store";

const handleError = (error) => {
  const { response } = error;
  let message = "An unknown error occurred.";

  if (response) {
    const { status, data } = response;
    message = data.message || message;
    console.log(response.status);
    if (response.status === 401) {
      // Custom error message for invalid credentials
      if (response.data.error === "Invalid credentials") {
        message = "Invalid username and password";
      } else {
        // Logout the user if status is 401 (Unauthorized)
        store.dispatch(logoutUser());
      }
    } else if (status === 413) {
      message = "File size exceeds the maximum limit of 100MB";
    }
  }

  return { success: false, message };
};

export { handleError };
