import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import NWA from "./context/NWA";
import ThemeProvider from "context/themeContext";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NWA>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </NWA>
  </React.StrictMode>
);
