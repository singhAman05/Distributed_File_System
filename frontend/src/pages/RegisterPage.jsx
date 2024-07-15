import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "services/authService";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import logo from "assets/bgImage.jpg";

const RegisterPage = () => {
  const [username, setUsername] = useState(""); // New username state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const user = await register(username, email, password); // Pass username to register
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-100 justify-center bg-cover bg-center relative">
      <div className="relative bg-background bg-opacity-90 shadow-md rounded-lg p-8 max-w-md w-full backdrop-blur-md">
        <div className="mb-6 text-center">
          <img src={logo} alt="Logo" className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in the details to register.
          </p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required // Make it required
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md"
          >
            Register
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-primary hover:underline">Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
