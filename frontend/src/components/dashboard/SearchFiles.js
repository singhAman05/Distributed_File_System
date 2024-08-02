import React, { useState } from "react";
import axios from "axios";
import { Input } from "components/ui/input";
import { Search, CloudDownload } from "lucide-react";
import { toast } from "sonner";
import FileIcon from "utils/fileIcon";
import { SyncLoader, PropagateLoader, HashLoader } from "react-spinners";
import { BackendUrl, SearchRoute } from "utils/config";
import { downloadFile } from "services/fileService";

const SearchFiles = () => {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true); // Mark that a search has been performed
    const loadingToastId = toast.loading("Searching your file...");
    try {
      const response = await axios.get(
        `${BackendUrl}/${SearchRoute}/search-files`,
        {
          params: { query },
        }
      );
      if (response.data.length === 0) {
        toast.error("File not found", { id: loadingToastId });
      } else {
        toast.success("Files found", { id: loadingToastId });
      }
      setFiles(response.data);
    } catch (error) {
      console.error("Error searching files:", error);
      toast.error("Error searching files", { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    setDownloading((prev) => ({ ...prev, [fileId]: true }));
    try {
      await downloadFile(fileId);
      toast.success("Download complete");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    } finally {
      setDownloading((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Files</h2>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Add the keyDown event handler
          className="flex-grow h-12"
        />
        <button
          onClick={handleSearch}
          className={`ml-2 shadow rounded-md p-2 flex items-center ${
            loading ? "bg-background" : "bg-primary hover:bg-secondary"
          } text-background`}
          style={{ width: "100px", height: "48px" }} // Fixed size for button
          disabled={loading}
        >
          {loading ? (
            <SyncLoader size={5} color="#30343F" />
          ) : (
            <>
              <Search size={20} className="mr-1" /> Search
            </>
          )}
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <PropagateLoader size={15} color="#273469" />
        </div>
      ) : searchPerformed && files.length === 0 ? (
        <div className="flex justify-center items-center mt-4">
          <p>We don't have your requested File</p>
        </div>
      ) : (
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
                disabled={downloading[file._id]}
              >
                {downloading[file._id] ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <HashLoader size={24} color="#273469" />
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
      )}
    </div>
  );
};

export default SearchFiles;
