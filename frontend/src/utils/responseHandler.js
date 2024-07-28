import { logoutUser } from "../redux/auth/authSlice";
import { store } from "../store";
import { toast } from "sonner";

const handleResponse = (response) => {
  let message = "An unknown error occurred.";

  if (response) {
    const { status, data } = response;
    message = data.message || message;

    if (status === 200) {
      toast.success("Request successful!");
      return { success: true, message };
    } else if (status === 401) {
      if (data.error === "Invalid credentials") {
        message = "Invalid username and password";
        toast.error(message);
      } else {
        store.dispatch(logoutUser());
        toast.error("Unauthorized access, logging out.");
      }
    } else if (status === 413) {
      message = "File size exceeds the maximum limit of 100MB";
      toast.error(message);
    } else {
      toast.error(message);
    }
  } else {
    toast.error(message);
  }

  return { success: false, message };
};

export { handleResponse };
