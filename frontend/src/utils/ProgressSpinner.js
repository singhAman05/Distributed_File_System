// src/utils/ProgressSpinner.js
import React from "react";
import PropTypes from "prop-types";

const ProgressSpinner = ({ progress, width = "100%", height = "20px" }) => {
  return (
    <div className="flex flex-col items-center" style={{ width }}>
      <div className="relative w-full">
        <div
          className="overflow-hidden h-full flex rounded bg-gray-200"
          style={{ height }}
        >
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300 ease-in-out"
          ></div>
        </div>
      </div>
      <div className="text-xs text-black mt-1">{progress}%</div>
    </div>
  );
};

ProgressSpinner.propTypes = {
  progress: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default ProgressSpinner;
