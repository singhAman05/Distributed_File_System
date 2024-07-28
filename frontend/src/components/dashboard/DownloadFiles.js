import React, { useState, useEffect } from "react";
import { listFiles, downloadFile } from "services/fileService";
import { CloudDownload } from "lucide-react";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";
import FileIcon from "utils/fileIcon"; // Adjust the import path as necessary

const DownloadFiles = () => {
  const [files, setFiles] = useState([]);
  const [downloading, setDownloading] = useState({}); // Track the downloading state for each file

  useEffect(() => {
    const fetchFiles = async () => {
      const loadingToastId = toast.loading("Loading files...");
      try {
        const data = await listFiles();
        setFiles(data);
        toast.success("Files loaded", { id: loadingToastId });
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Error fetching files", { id: loadingToastId });
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (fileId) => {
    setDownloading((prev) => ({ ...prev, [fileId]: true })); // Set the downloading state for the specific file
    try {
      await downloadFile(fileId);
      toast.success("Download complete");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    } finally {
      setDownloading((prev) => ({ ...prev, [fileId]: false })); // Reset the downloading state for the specific file
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Download Files</h2>
      <p className="text-gray-700 mb-4">
        Here are the top 20 most recent files uploaded by users from all over
        the world. Feel free to explore and download!
      </p>
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex flex-col sm:flex-row items-center p-4 bg-background hover:shadow-lg duration-200 shadow-md rounded-md"
          >
            <div className="mr-4">
              <FileIcon mimeType={file.mimeType} />
            </div>
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
              className={`flex items-center text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4 transition-colors duration-200 ${
                downloading[file._id]
                  ? "bg-white text-primary"
                  : "bg-primary hover:bg-secondary"
              }`}
              onClick={() => handleDownload(file._id)}
              disabled={downloading[file._id]} // Disable button while downloading
            >
              {downloading[file._id] ? (
                <div className="flex justify-center items-center w-full h-full">
                  <HashLoader
                    size={24} // Adjust the size to match the button height
                    color="#273469" // Set the color to match the button text color
                  />
                </div>
              ) : (
                <>
                  <CloudDownload className="text-2xl mr-2" /> Download
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
