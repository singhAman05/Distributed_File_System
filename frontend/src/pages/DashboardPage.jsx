// src/pages/DashboardPage.js
import React from "react";
import Sidebar from "components/dashboard/Sidebar";
import DashboardContent from "components/dashboard/DashboardContent";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <DashboardContent />
    </div>
  );
};

export default DashboardPage;
