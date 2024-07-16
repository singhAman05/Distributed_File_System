// src/components/Dashboard/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/authSlice";
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
import { Skeleton } from "components/ui/skeleton";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div
      className={`flex flex-col h-screen bg-white shadow-md transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
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
              <House className="inline-block" /> {!isCollapsed && "Home"}
            </Link>
            <Link
              to="/upload"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/upload"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Upload className="inline-block" /> {!isCollapsed && "Upload"}
            </Link>
            <Link
              to="/download"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/download"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Download className="inline-block" /> {!isCollapsed && "Download"}
            </Link>
            <Link
              to="/search"
              className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
                location.pathname === "/search"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Search className="inline-block" /> {!isCollapsed && "Search"}
            </Link>
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
            <button
              onClick={handleLogout}
              className="block py-2.5 px-4 rounded-r-md text-gray-700 hover:bg-gray-200 w-full text-left transition duration-200"
            >
              <LogOut className="inline-block" /> {!isCollapsed && "Logout"}
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
