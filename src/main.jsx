/**
 * main.jsx — Application Entry Point
 *
 * Sets up the React app with all required providers in correct nesting order:
 *   1. StrictMode     — Enables extra development-mode checks
 *   2. BrowserRouter  — Provides client-side routing (react-router-dom)
 *   3. AuthProvider   — Global auth state (must be inside Router for navigation)
 *   4. NotificationProvider — Global notification state
 *   5. App            — Root component with route definitions
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
