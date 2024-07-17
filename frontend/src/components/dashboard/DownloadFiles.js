// src/components/Dashboard/DownloadFiles.js
import React, { useState, useEffect } from "react";
import { listFiles, downloadFile } from "services/fileService";
import {
  Folder,
  Image,
  FileText,
  Text,
  Download,
  Clapperboard,
  Music,
  Braces,
} from "lucide-react";

const DownloadFiles = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null); // Track the file being downloaded

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await listFiles();
        console.log(data);
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Error fetching files");
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (fileId) => {
    setDownloading(fileId); // Set the downloading state
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Error downloading file");
    } finally {
      setDownloading(null); // Reset the downloading state
    }
  };

  const getFileIcon = (file) => {
    const fileType = file.mimeType;
    if (fileType.startsWith("image/")) {
      return <Image className="text-2xl" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="text-2xl" />;
    } else if (fileType.startsWith("text/")) {
      return <Text className="text-2xl" />;
    } else if (fileType.startsWith("video/")) {
      return <Clapperboard className="text-2xl" />; // Add video icon
    } else if (fileType === "application/json") {
      return <Braces className="text-2xl" />; // Use text icon for JSON
    } else if (fileType.startsWith("audio/")) {
      return <Music className="text-2xl" />; // Add music icon
    } else {
      return <Folder className="text-2xl" />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Download Files</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex flex-col sm:flex-row items-center p-4 bg-background hover:shadow-lg duration-200 shadow-md rounded-md"
          >
            <div className="mr-4">{getFileIcon(file)}</div>
            <div className="border-r border-gray-300 h-12 mx-2 hidden sm:block"></div>
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="font-bold text-center sm:text-left">
                  {file.filename}
                </div>
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Uploaded by: {file.uploaded_by.username}
                </div>
                <div className="border-r border-gray-300 h-4 mx-2 hidden sm:block"></div>
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Downloads: {file.download_count}
                </div>
              </div>
            </div>
            <button
              className={`bg-primary flex items-center ${
                downloading === file._id ? "bg-gray-400" : "hover:bg-secondary"
              } text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4`}
              onClick={() => handleDownload(file._id)}
              disabled={downloading === file._id} // Disable button while downloading
            >
              {downloading === file._id ? (
                <>Downloading...</>
              ) : (
                <>
                  <Download className="text-2xl mr-2" /> Download
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadFiles;
