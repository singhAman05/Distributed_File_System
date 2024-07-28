import React, { useEffect, useState } from "react";
import FileIcon from "utils/fileIcon";
import SystemStatus from "utils/systemStatus";
import "react-circular-progressbar/dist/styles.css";
import { getProfile } from "services/profileService";
import ChartComponent from "utils/generateChart";

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

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

    const storedUser = JSON.parse(localStorage.getItem("user")).user;
    console.log(storedUser);
    if (storedUser && storedUser.username) {
      setUsername(storedUser.username);
    }

    fetchProfile();
  }, []);

  if (profile === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-medium">
        Welcome <span className="font-semibold text-3xl">{username}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 space-y-4">
          <div className="bg-background p-4 shadow-md hover:shadow-lg duration-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Stats</h2>
            <hr className="border-gray-300 my-2" />
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">Downloads</div>
                <div className="text-lg font-medium">
                  {profile.dates.reduce(
                    (acc, date) => acc + date.downloadCount,
                    0
                  ) || 0}
                </div>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-[#9b19f5] h-4 rounded-full animate-pulse"
                  style={{
                    width: `${Math.min(
                      (profile.dates.reduce(
                        (acc, date) => acc + date.downloadCount,
                        0
                      ) /
                        10) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">Uploads</div>
                <div className="text-lg font-medium">
                  {profile.dates.reduce(
                    (acc, date) => acc + date.uploadCount,
                    0
                  ) || 0}
                </div>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-[#ffa300] h-4 rounded-full animate-pulse"
                  style={{
                    width: `${Math.min(
                      (profile.dates.reduce(
                        (acc, date) => acc + date.uploadCount,
                        0
                      ) /
                        10) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Downloads:</span>
                  <span>
                    {profile.dates.reduce(
                      (acc, date) => acc + date.downloadCount,
                      0
                    ) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Uploads:</span>
                  <span>
                    {profile.dates.reduce(
                      (acc, date) => acc + date.uploadCount,
                      0
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SystemStatus />
        </div>

        <div className="col-span-2 bg-background p-4 shadow-md hover:shadow-lg duration-200 rounded-lg">
          <h2 className="text-xl font-semibold">Upload/Download Activity</h2>
          <hr className="border-gray-300 my-2" />
          <ChartComponent profile={profile} />
        </div>
      </div>

      <div className="bg-transparent p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Actions</h2>
        {profile.dates.length === 0 ? (
          <p>Do some actions, bro, to see them here :)</p>
        ) : (
          <div className="space-y-4">
            {profile.dates
              .flatMap((dateData) => dateData.recentActions)
              .slice(-10)
              .reverse()
              .map((action, index) => (
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
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
