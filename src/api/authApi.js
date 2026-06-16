import axiosInstance from "./axiosInstance";

// Authentication API functions
// This file contains all endpoints related to user authentication

// Register a new user
// Endpoint: POST /accounts/register/
// Sends user registration data to backend
export const register = async(data)=>{
    const response = await axiosInstance.post(
        "/accounts/register/",
        data
    );

    return response.data;
};


// Login user
// Endpoint: POST /accounts/login/
// Sends email and password
// Backend returns access and refresh JWT tokens
export const login = async(data)=>{
    const response = await axiosInstance.post(
        "/accounts/login/",
        data
    );

    return response.data;
};


// Refresh expired access token
// Endpoint: POST /accounts/api/token/refresh/
// Sends refresh token and receives new access token
export const refreshToken = async(refresh)=>{
    const response = await axiosInstance.post(
        "/accounts/api/token/refresh/",
        {
            refresh:refresh
        }
    );

    return response.data;
};


// Get current user profile
// Endpoint: GET /accounts/me/
// Requires Authorization Bearer token
export const getProfile = async()=>{
    const response = await axiosInstance.get(
        "/accounts/me/"
    );

    return response.data;
};


// Update current user profile
// Endpoint: PATCH /accounts/me/
// Partial update allowed
// Requires Authorization Bearer token
export const updateProfile = async(data)=>{
    const response = await axiosInstance.patch(
        "/accounts/me/",
        data
    );

    return response.data;
};