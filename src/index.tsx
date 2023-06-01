import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./features/App";
import { FolderContextProvider } from "./contexts/FolderProvider";
import { FolderNavContextProvider } from "./contexts/FolderNavProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <FolderContextProvider>
      <FolderNavContextProvider>
        <App />
      </FolderNavContextProvider>
    </FolderContextProvider>
  </React.StrictMode>
);
