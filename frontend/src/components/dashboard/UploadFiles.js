// src/components/Dashboard/UploadFiles.js
import React, { useState, useRef } from "react";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import ProgressSpinner from "utils/ProgressSpinner";
import { uploadFile } from "services/fileService";
import { Folder, Image, FileText, Text, CircleX } from "lucide-react"; // Import icons for file types and cancel

const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const uploadController = useRef(null); // Initialize as null

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
      setError(null);
    }
  };

  const handleUploadClick = async () => {
    if (file) {
      setUploading(true);
      uploadController.current = new AbortController(); // Initialize the AbortController before the upload
      try {
        const response = await uploadFile(
          file,
          setProgress,
          uploadController.current.signal
        );
        console.log("Upload complete:", response);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Upload canceled");
        } else {
          console.error("Error:", error);
          if (error.response && error.response.status === 413) {
            setError("File size exceeds the maximum limit of 100MB");
          } else {
            setError(error.message);
          }
        }
      } finally {
        setUploading(false);
      }
    } else {
      setError("No file selected");
      console.error("No file selected");
    }
  };

  const handleCancelClick = () => {
    if (uploading) {
      uploadController.current.abort(); // Use the AbortController to cancel the upload
      setUploading(false);
      setProgress(0);
    }
  };

  const getFileIcon = (file) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <Image className="text-4xl" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="text-4xl" />;
    } else if (fileType.startsWith("text/")) {
      return <Text className="text-4xl" />;
    } else {
      return <Folder className="text-4xl" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
      <div className="flex items-center mb-4 space-x-4">
        {file && <div>{getFileIcon(file)}</div>}
        <Input type="file" onChange={handleFileChange} className="flex-grow" />
        {progress > 0 && (
          <div style={{ width: "200px" }}>
            <ProgressSpinner progress={progress} width="100%" height="20px" />
          </div>
        )}
        {uploading && (
          <CircleX
            className="text-4xl cursor-pointer"
            onClick={handleCancelClick}
          />
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Button
        className="bg-primary hover:bg-secondary text-white"
        onClick={handleUploadClick}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default UploadFiles;
