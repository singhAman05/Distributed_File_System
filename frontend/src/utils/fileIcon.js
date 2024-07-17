// FileIcon.js
import React from "react";
import {
  Folder,
  Image,
  FileText,
  Text,
  Clapperboard,
  Music,
  Braces,
} from "lucide-react";

const FileIcon = ({ mimeType }) => {
  if (mimeType.startsWith("image/")) {
    return <Image className="text-2xl" />;
  } else if (mimeType === "application/pdf") {
    return <FileText className="text-2xl" />;
  } else if (mimeType.startsWith("text/")) {
    return <Text className="text-2xl" />;
  } else if (mimeType.startsWith("video/")) {
    return <Clapperboard className="text-2xl" />;
  } else if (mimeType === "application/json") {
    return <Braces className="text-2xl" />;
  } else if (mimeType.startsWith("audio/")) {
    return <Music className="text-2xl" />;
  } else {
    return <Folder className="text-2xl" />;
  }
};

export default FileIcon;
