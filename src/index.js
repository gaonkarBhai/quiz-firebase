import React from "react";
import ReactDOM from "react-dom/client";
import "./App.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import LoggedInProvider from "./context/isLoggedContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <LoggedInProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    </LoggedInProvider>
  </BrowserRouter>
);
