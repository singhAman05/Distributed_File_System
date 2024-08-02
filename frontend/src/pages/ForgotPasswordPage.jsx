import React, { useState } from "react";
import { sendPasswordResetEmail } from "services/authService";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sendPasswordResetEmail(email);
      toast.success(response.message || "Recovery email sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-background rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-text">
          Forgot Password
        </h1>
        <p className="text-center mb-4">
          Enter your email address and if it is present in our database, we will
          send a recovery email to the submitted email.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white p-3 rounded-md flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={24} color={"#ffffff"} />
              ) : (
                "Send Recovery Email"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
