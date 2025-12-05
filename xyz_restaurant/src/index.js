import React from "react";
import ReactDOM from "react-dom/client";
import RootApp from "./App";   // ✅ Import RootApp, not App

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

