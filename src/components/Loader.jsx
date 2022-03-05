import React from "react";
import { ReactComponent as SpinLoader } from "../img/Spinner1.svg";
import "../App.css";

function Loader() {
  return (
    <div className="spinner">
      <SpinLoader />
    </div>
  );
}

export default Loader;
