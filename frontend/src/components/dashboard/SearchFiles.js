// src/components/Dashboard/SearchFiles.js
import React from "react";
import { Input } from "components/ui/input";

const SearchFiles = () => {
  const handleSearch = (e) => {
    // Implement search logic here
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Files</h2>
      <Input
        type="text"
        placeholder="Search files"
        onChange={handleSearch}
        className="w-full mb-4"
      />
    </div>
  );
};

export default SearchFiles;
