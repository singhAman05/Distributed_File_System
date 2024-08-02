import React, { useState } from "react";
import Sidebar from "components/dashboard/Sidebar";
import DashboardContent from "components/dashboard/DashboardContent";
import useAuth from "hooks/useAuth";

const DashboardPage = () => {
  useAuth(); // Add the useAuth hook to check authentication
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardPage;
