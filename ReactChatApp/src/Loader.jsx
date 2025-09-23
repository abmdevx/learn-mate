// Loader.jsx
import React from "react";
import "./index.css"; // your custom styles (optional)

const Loader = ({ show = true }) => {
  if (!show) return null; // hide loader if show=false

  return (
    <div id="global-loader">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default Loader;