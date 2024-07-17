import React, { useEffect, useState } from "react";
import FileIcon from "utils/fileIcon";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getProfile } from "services/profileService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const [profile, setProfile] = useState(null); // Changed initial state to null
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        setError("Error fetching profile data");
        console.error("Error fetching profile data", error);
      }
    };

    fetchProfile();
  }, []);

  const generateChartData = (profile) => {
    const labels = profile.dates.map((dateData) =>
      new Date(dateData.date).toLocaleDateString()
    );
    const uploadCounts = profile.dates.map((dateData) => dateData.uploadCount);
    const downloadCounts = profile.dates.map(
      (dateData) => dateData.downloadCount
    );

    return {
      labels,
      datasets: [
        {
          label: "Uploads",
          data: uploadCounts,
          borderColor: "rgba(70, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: "Downloads",
          data: downloadCounts,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
      ],
    };
  };

  if (profile === null) {
    return <div>Loading...</div>;
  }

  const chartData = generateChartData(profile);

  return (
    <div className="p-4 space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">Welcome {profile.user?.username}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* UserStatus Section */}
        <div className="col-span-1 space-y-4">
          <div className="bg-background p-4 shadow-md hover:shadow-lg duration-200 rounded-lg flex flex-col items-center">
            <h2 className="text-xl">User Stats</h2>
            <div className="flex space-x-4 mt-4">
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={
                    profile.dates.reduce(
                      (acc, date) => acc + date.uploadCount,
                      0
                    ) || 0
                  }
                  text={`U: ${
                    profile.dates.reduce(
                      (acc, date) => acc + date.uploadCount,
                      0
                    ) || 0
                  }`}
                />
              </div>
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={
                    profile.dates.reduce(
                      (acc, date) => acc + date.downloadCount,
                      0
                    ) || 0
                  }
                  text={`D: ${
                    profile.dates.reduce(
                      (acc, date) => acc + date.downloadCount,
                      0
                    ) || 0
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Sections */}
        <div className="col-span-2 bg-background p-4 shadow-md hover:shadow-lg duration-200 rounded-lg">
          <h2 className="text-xl">Upload/Download Activity</h2>
          <div className="h-64">
            {profile.dates.length ? (
              <Line data={chartData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-transparent p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Actions</h2>
        {profile.dates.length === 0 ? (
          <p>Do some actions, bro, to see them here :)</p>
        ) : (
          <div className="space-y-4">
            {profile.dates.flatMap((dateData) =>
              dateData.recentActions.map((action, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center p-4 bg-background hover:shadow-lg duration-200 shadow-md rounded-md"
                >
                  <div className="mr-4">
                    <FileIcon mimeType={action.fileType} />
                  </div>
                  <div className="border-r border-gray-300 h-12 mx-2 hidden sm:block"></div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="font-bold text-center sm:text-left">
                        {action.fileName}
                      </div>
                      <div className="text-sm text-gray-500 text-center sm:text-left">
                        Size: {(action.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
                      <div className="text-sm text-gray-500 text-center sm:text-left">
                        Action Type: {action.actionType}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
