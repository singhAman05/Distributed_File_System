import React, { useState } from "react";
import Sidebar from "components/dashboard/Sidebar";
import DashboardContent from "components/dashboard/DashboardContent";
import { Toaster } from "sonner";

const DashboardPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <Toaster />
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow transition-all duration-300 p-4 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardPage;
