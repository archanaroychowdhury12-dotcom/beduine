import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { assertBackendModeAllowed, assertProductionEnvReady } from "./config/productionEnv";

assertBackendModeAllowed(import.meta.env);
assertProductionEnvReady(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
