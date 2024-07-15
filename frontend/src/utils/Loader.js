// src/utils/Loader.js

import React from "react";
import PropTypes from "prop-types";

const Loader = ({ size = 24, color = "text-blue-500" }) => {
  return (
    <div className={`flex justify-center items-center ${color}`}>
      <svg
        className={`animate-spin h-${size} w-${size}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;
