import React from "react";
import ReactDOM from "react-dom/client";
import "./App.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import LoggedInProvider from "./context/isLoggedContext";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <LoggedInProvider>
      <React.StrictMode>
        <Analytics />
        <App />
        <SpeedInsights />
      </React.StrictMode>
    </LoggedInProvider>
  </BrowserRouter>
);
