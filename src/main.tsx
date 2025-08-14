import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserDataProvider } from "./userdata/store";
import "./index.css";
import { ServerStatusProvider } from "./server/ServerStatusProvider";
import BootGate from "./server/BootGate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BootGate>
        <ServerStatusProvider>
          <UserDataProvider>
            <App />
          </UserDataProvider>
        </ServerStatusProvider>
      </BootGate>
    </BrowserRouter>
  </React.StrictMode>
);
