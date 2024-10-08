import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadFiles from "components/dashboard/UploadFiles";
import DownloadFiles from "components/dashboard/DownloadFiles";
import UserDashboard from "components/dashboard/UserDashboard";
import SearchFiles from "components/dashboard/SearchFiles";

const DashboardContent = () => {
  return (
    <div className="flex-1 p-6">
      <Routes>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/upload" element={<UploadFiles />} />
        <Route path="/download" element={<DownloadFiles />} />
        <Route path="/search" element={<SearchFiles />} />
      </Routes>
    </div>
  );
};

export default DashboardContent;
