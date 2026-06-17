/**
 * axiosInstance.js — Central HTTP Client
 *
 * Creates a pre-configured Axios instance used by all API modules.
 * Handles two critical concerns:
 *   1. Request interceptor:  Attaches JWT access token to every request
 *   2. Response interceptor: Auto-refreshes expired tokens on 401 errors
 *
 * Other API files (authApi, listingsApi, etc.) import this instance
 * instead of raw axios, so auth is handled transparently.
 */

import axios from "axios";

// ---------------------------------------------------------------------------
// Create Axios Instance
// ---------------------------------------------------------------------------
const axiosInstance = axios.create({
  // Base URL loaded from Vite environment variable (.env file)
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request Interceptor — Attach JWT Token
// ---------------------------------------------------------------------------
// Runs BEFORE every outgoing request.
// Reads the access token from localStorage and sets the Authorization header.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor — Auto-Refresh on 401 Unauthorized
// ---------------------------------------------------------------------------
// When the backend returns 401 (token expired), this interceptor:
//   1. Takes the refresh token from localStorage
//   2. Calls the Django token-refresh endpoint to get a new access token
//   3. Stores the new access token and retries the original request
//   4. If refresh also fails, clears tokens and redirects to /login
//
// The `_retry` flag prevents infinite loops if the refresh itself returns 401.
axiosInstance.interceptors.response.use(
  // Successful responses pass through unchanged
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 errors, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Request a new access token using the refresh token
          // NOTE: Uses raw axios (not axiosInstance) to avoid triggering
          // this same interceptor if the refresh endpoint returns 401
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/accounts/api/token/refresh/`,
            { refresh: refreshToken }
          );

          // Store the fresh access token
          localStorage.setItem("access_token", data.access);

          // Update the failed request's Authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token is also expired/invalid — force logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;