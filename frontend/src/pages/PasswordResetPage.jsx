import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "services/authService";
import { BackendUrl, AuthRoute } from "utils/config";
import axios from "axios";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort(); // Abort the request after 3 seconds
        toast.error("Request timed out. Please try again.");
      }, 3000);

      try {
        const response = await axios.get(
          `${BackendUrl}/${AuthRoute}/verify-password-reset/${token}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId); // Clear the timeout if the response is received
        if (response.data.userId) {
          setIsValid(true);
          setUserId(response.data.userId);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          toast.error("The reset link has expired or is invalid.");
        }
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(userId, newPassword);
      toast.success("Password has been reset. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} color={"#000"} />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">{"Verifying..."}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-lg">
        <h1 className="text-2xl text-text font-bold text-center mb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-text mb-2">
              New Password
            </label>
            <Input
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-text mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={24} color={"#ffffff"} />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
