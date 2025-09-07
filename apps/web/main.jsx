import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.jsx";
import "reactflow/dist/style.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
