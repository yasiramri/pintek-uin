import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";  // Import CSS Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";  // Import JS Bootstrap
import App from "./app";

import "./styles/styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
