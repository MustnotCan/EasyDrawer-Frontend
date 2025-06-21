import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./css/index.css";

// Extend Window interface
declare global {
  interface Window {
    __APP_STARTED__?: boolean;
    __RUNTIME_CONFIG__?: Envs;
  }
}

type Envs = { VITE_API_MAIN?: string };
export const runtimeConfig: Envs = window.__RUNTIME_CONFIG__ ?? {};

window.__RUNTIME_CONFIG__ = runtimeConfig; // persist across HMR

function startApp() {
  if (window.__APP_STARTED__) return;
  window.__APP_STARTED__ = true;

  ReactDOM.hydrateRoot(
    document,
    <React.StrictMode>
      <HydratedRouter />
    </React.StrictMode>
  );
}

if (import.meta.env.PROD) {
  // Production: Load config from public/config.json
  (async function loadConfig() {
    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error("Failed to load config.json");
      }
      const config = await response.json();
      runtimeConfig.VITE_API_MAIN = config.API;
    } catch (error) {
      console.error("Error loading configuration:", error);
    } finally {
      startApp();
    }
  })();
} else {
  // Development: Use VITE_API_MAIN from Vite env
  runtimeConfig.VITE_API_MAIN = import.meta.env.VITE_API_MAIN;
  console.log("dev", runtimeConfig.VITE_API_MAIN);
  startApp();
}
