import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./features/App";
import { FolderContextProvider } from "./contexts/FolderProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <FolderContextProvider>
      <App />
    </FolderContextProvider>
  </React.StrictMode>
);
