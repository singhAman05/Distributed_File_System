// src/pages/PasswordResetPage.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "services/authService";
import axios from "axios";
import Loader from "utils/Loader";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
        setMessage("Request timed out. Please try again.");
      }, 3000);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/v1/verify-password-reset/${token}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId); // Clear the timeout if the response is received
        if (response.data.userId) {
          setIsValid(true);
          setUserId(response.data.userId);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          setMessage("The reset link has expired or is invalid.");
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
      setMessage("Passwords do not match");
      return;
    }
    try {
      await resetPassword(userId, newPassword);
      setMessage("Password has been reset. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          {message || "Verifying..."}
        </div>
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
            className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <Loader size={6} color="text-white" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetPage;
