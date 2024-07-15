// src/components/Dashboard/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Upload,
  Download,
  House,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { Skeleton } from "components/ui/skeleton"; // Import the ShadCN Skeleton component

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Set loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col h-screen bg-white shadow-md transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60" // Adjusted width
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed ? (
          <div className="text-center font-bold text-xl">DFS Dashboard</div>
        ) : (
          <div>
            <LayoutGrid className="text-gray-700" />
          </div>
        )}
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isCollapsed ? (
            <ChevronRight className="text-gray-700" />
          ) : (
            <ChevronLeft className="text-gray-700" />
          )}
        </button>
      </div>

      <nav className={`mt-10 flex-grow transition-opacity duration-300`}>
        {loading ? (
          <>
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/dashboard"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <House className="inline-block" /> {!isCollapsed && "Dashboard"}
            </Link>
            <Link
              to="/upload"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/upload"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Upload className="inline-block" />{" "}
              {!isCollapsed && "Upload Files"}
            </Link>
            <Link
              to="/download"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/download"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Download className="inline-block" />{" "}
              {!isCollapsed && "Download Files"}
            </Link>
            <Link
              to="/search"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/search"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Search className="inline-block" />{" "}
              {!isCollapsed && "Search Files"}
            </Link>
          </>
        )}
      </nav>

      <div className="p-0">
        {loading ? (
          <>
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
            <Skeleton className="block h-10 w-full mb-2 rounded-md" />
          </>
        ) : (
          <>
            <Link
              to="/settings"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/settings"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Settings className="inline-block" /> {!isCollapsed && "Settings"}
            </Link>
            <Link
              to="/logout"
              className="block py-2.5 px-4 rounded-r-md transition duration-200 text-gray-700 hover:bg-gray-200"
            >
              <LogOut className="inline-block" /> {!isCollapsed && "Logout"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
