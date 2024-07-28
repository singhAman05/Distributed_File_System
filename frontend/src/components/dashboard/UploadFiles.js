import React, { useState, useRef } from "react";
import { Input } from "components/ui/input";
import ProgressSpinner from "utils/ProgressSpinner";
import { uploadFile } from "services/fileService";
import { CircleX, CloudUpload } from "lucide-react";
import { PacmanLoader, ClipLoader } from "react-spinners";
import { toast } from "sonner";
import FileIcon from "utils/fileIcon"; // Adjust the import path as necessary

const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const uploadController = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadClick = async () => {
    if (file) {
      setUploading(true);
      uploadController.current = new AbortController();
      try {
        const response = await uploadFile(
          file,
          setProgress,
          uploadController.current.signal
        );
        console.log("Upload complete:", response);
        toast.success("Upload Complete");
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setFile(null); // Reset the file state
          setProgress(0); // Reset the progress state
        }, 2000); // Show Propagate loader for 2 seconds
      } catch (error) {
        console.error("Error:", error.message);
        toast.error(error.message);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error("No File Selected");
      console.error("No file selected");
    }
  };

  const handleCancelClick = () => {
    if (uploading) {
      uploadController.current.abort();
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
      <p className="text-gray-700 mb-4">
        You can upload files in any format now. Please note that the maximum
        file upload limit is 100MB.
      </p>

      <div className="flex items-center mb-4 space-x-4">
        {file && <FileIcon mimeType={file.type} />}
        <Input type="file" onChange={handleFileChange} className="flex-grow" />
        {progress > 0 && !uploadSuccess && (
          <div style={{ width: "200px" }}>
            <ProgressSpinner progress={progress} width="100%" height="20px" />
          </div>
        )}
        {uploading && !uploadSuccess && (
          <CircleX
            className="text-4xl cursor-pointer"
            onClick={handleCancelClick}
          />
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        className={`flex items-center text-white px-4 py-2 rounded mt-2 ml-0 sm:mt-0 sm:ml-4 transition-colors duration-200 ${
          uploading
            ? "bg-transparent text-transparent"
            : "bg-primary hover:bg-secondary"
        }`}
        onClick={handleUploadClick}
        disabled={uploading} // Disable button while uploading
      >
        {uploading ? (
          <div className="flex justify-center items-center w-full h-full">
            <PacmanLoader
              size={16} // Adjust the size to match the button height
              color="#273469" // Set the color to match the button text color
            />
          </div>
        ) : uploadSuccess ? (
          <div className="flex justify-center items-center w-full h-full">
            <ClipLoader
              size={16} // Adjust the size to match the button height
              color="#FAFAFF" // Set the color to match the button text color
            />
            <span className="text-background ml-2">Almost there...</span>
          </div>
        ) : (
          <>
            <CloudUpload className="text-2xl mr-2" />
            Upload
          </>
        )}
      </button>
    </div>
  );
};

export default UploadFiles;
