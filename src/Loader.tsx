import "./index.css";

const Loader = ({ show = true, fadeOut = false }) => {
  if (!show) return null; // hide loader if show=false

  return (
    <div id="global-loader" className={fadeOut ? "fade-out" : ""}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default Loader;