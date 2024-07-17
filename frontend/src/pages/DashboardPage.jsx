// src/pages/DashboardPage.js
import React from "react";
import Sidebar from "components/dashboard/Sidebar";
import DashboardContent from "components/dashboard/DashboardContent";

const DashboardPage = () => {
  return (
    <div className="flex  bg-gray-100">
      <Sidebar />
      <div className="flex-grow ml-64 p-4 bg-gray-100">
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardPage;
