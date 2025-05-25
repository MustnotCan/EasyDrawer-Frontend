import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./css/index.css";
/*type envs = { VITE_API_MAIN?: string };
export const runtimeConfig: envs = {};
if (import.meta.env.PROD) {
  async function loadConfig() {
    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error("Failed to load config.json");
      }
      const config = await response.json();
      runtimeConfig.VITE_API_MAIN = config.VITE_API_MAIN;
    } catch (error) {
      console.error("Error loading configuration:", error);
    }
  }
  loadConfig().then(() => {
    ReactDOM.hydrateRoot(
      document,
      <React.StrictMode>
        <HydratedRouter />
      </React.StrictMode>
    );
  });
} else if (import.meta.env.DEV) {
  runtimeConfig.VITE_API_MAIN = import.meta.env.VITE_API_MAIN;
 
}*/
ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>
);
