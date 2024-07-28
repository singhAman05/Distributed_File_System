import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import { BackendUrl, SystemRoute } from "./config";

const SystemStatus = () => {
  const [totalNodes, setTotalNodes] = useState(0);
  const [runningNodes, setRunningNodes] = useState(0);
  const [status, setStatus] = useState({
    text: "Loading...",
    color: "gray-500",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}/${SystemRoute}/system-status`
        );
        const data = response.data;
        console.log("Fetched system status data:", response); // Debugging log
        setTotalNodes(data.totalNodes);
        setRunningNodes(data.runningNodes);
      } catch (error) {
        console.error("Error fetching system status:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Running nodes:", runningNodes); // Debugging log
    console.log("Total nodes:", totalNodes); // Debugging log

    if (totalNodes === 0) {
      // Prevent division by zero
      setStatus({ text: "No data", color: "gray-500" });
      return;
    }

    const runningPercentage = (runningNodes / totalNodes) * 100;
    console.log("Running percentage:", runningPercentage); // Debugging log

    if (runningPercentage >= 90) {
      setStatus({ text: "Good", color: "green-500" });
    } else if (runningPercentage >= 70) {
      setStatus({ text: "Manageable", color: "yellow-500" });
    } else if (runningPercentage >= 40) {
      setStatus({ text: "Poor", color: "orange-500" });
    } else {
      setStatus({ text: "Bad", color: "red-500" });
    }
  }, [runningNodes, totalNodes]);

  const runningPercentage =
    totalNodes === 0 ? 0 : (runningNodes / totalNodes) * 100;

  return (
    <div className="bg-background p-4 shadow-md hover:shadow-lg duration-200 rounded-lg mt-4">
      <h2 className="text-xl font-semibold">System Status</h2>
      <hr className="border-gray-300 my-2" />
      <div className="mt-4">
        <div className="text-sm text-gray-500 mb-2">
          Current Running Nodes: {runningNodes} / {totalNodes}
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${runningPercentage}%` }}
          />
        </div>
        <div className="flex items-center">
          <div
            className={classNames("w-3 h-3 rounded-full mr-2", {
              "bg-green-500": status.color === "green-500",
              "bg-yellow-500": status.color === "yellow-500",
              "bg-orange-500": status.color === "orange-500",
              "bg-red-500": status.color === "red-500",
              "bg-gray-500": status.color === "gray-500",
            })}
          ></div>
          <div className="text-sm text-gray-500">
            System Status: {status.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
