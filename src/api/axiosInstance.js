import axios from "axios";

// Create a reusable Axios instance with a predefined configuration
// This avoids repeating the base URL and common headers in every API call
const axiosInstance = axios.create({
    // Base URL for all API requests, loaded from environment variables
    baseURL: import.meta.env.VITE_API_URL,
    // Default header type for sending JSON data to the backend
    headers:{
        "Content-Type":"application/json",
    }
});

// REQUEST INTERCEPTOR
// Runs before every request is sent
// Used here to automatically attach the JWT access token to API requests

axiosInstance.interceptors.request.use(
    (config)=>{
        // Get stored access token from browser local storage
        const token = localStorage.getItem("access_token");
        // If token exists, add it to Authorization header
        // Backend will use this token to authenticate the user
        if(token){
            config.headers.Authorization =
            `Bearer ${token}`;
        }
        // Return modified request configuration
        return config;
    },
    // Handle request errors before sending
    (error)=>{
        return Promise.reject(error);
    }
);

// Export configured Axios instance
// Other files can import this and directly make authenticated API calls
export default axiosInstance;