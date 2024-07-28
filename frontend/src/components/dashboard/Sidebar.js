import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/authSlice";
import {
  Upload,
  Download,
  House,
  ScanSearch,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to control submenu visibility

  const handleLogout = () => {
    toast.loading("Logging you out...");
    setTimeout(() => {
      dispatch(logoutUser());
      toast.dismiss(); // Dismiss the loading toast
      toast.success("Logged out successfully");
      navigate("/login");
    }, 2000); // 3 seconds delay
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleMouseEnter = () => {
    setIsSettingsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div
      className={`flex flex-col fixed h-screen bg-background shadow-md transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed ? (
          <div className="text-center font-bold text-xl">DFS Dashboard</div>
        ) : (
          <div>
            <LayoutDashboard className="text-gray-700" />
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

      <nav
        className={`mt-10 flex-grow flex flex-col transition-opacity duration-300`}
        style={{ height: "calc(100vh - 4rem)", overflow: "hidden" }} // Adjusted height and overflow
      >
        <div className="flex-grow overflow-y-auto">
          <Link
            to="/dashboard"
            className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
              location.pathname === "/dashboard"
                ? "bg-secondary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <House className="inline-block mr-2" />
            <span
              className={`transition-opacity duration-300 delay-150 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && "Home"}
            </span>
          </Link>
          <Link
            to="/upload"
            className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
              location.pathname === "/upload"
                ? "bg-secondary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Upload className="inline-block mr-2" />
            <span
              className={`transition-opacity duration-300 delay-150 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && "Upload"}
            </span>
          </Link>
          <Link
            to="/download"
            className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
              location.pathname === "/download"
                ? "bg-secondary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Download className="inline-block mr-2" />
            <span
              className={`transition-opacity duration-300 delay-150 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && "Download"}
            </span>
          </Link>
          <Link
            to="/search"
            className={`block py-2.5 px-4 rounded-r-md transition duration-200 ${
              location.pathname === "/search"
                ? "bg-secondary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ScanSearch className="inline-block mr-2" />
            <span
              className={`transition-opacity duration-300 delay-150 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && "Search"}
            </span>
          </Link>
        </div>

        <div className="mt-auto">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`block py-2.5 px-4 rounded-r-md w-full text-left transition duration-200 ${
                location.pathname === "/settings"
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Settings className="inline-block mr-2" />
              <span
                className={`transition-opacity duration-300 delay-150 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                {!isCollapsed && "Settings"}
              </span>
            </div>

            {isSettingsOpen && (
              <div
                className={`absolute left-full top-0 z-10 bg-background shadow-md rounded-md mt-2 ${
                  isCollapsed ? "w-0" : "w-48"
                } transition-width duration-300`}
              >
                <Link
                  to="/contact"
                  className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 rounded-md transition duration-200"
                >
                  Contact Us
                </Link>
                <Link
                  to="/profile"
                  className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 rounded-md transition duration-200"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="block py-2.5 px-4 rounded-r-md text-gray-700 hover:bg-gray-200 w-full text-left transition duration-200"
          >
            <LogOut className="inline-block mr-2" />
            <span
              className={`transition-opacity duration-300 delay-150 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && "Logout"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
