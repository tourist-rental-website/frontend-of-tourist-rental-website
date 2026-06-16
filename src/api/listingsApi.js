import axiosInstance from "./axiosInstance";

// Listings API functions
// Handles guides, hotels, rooms, and packages endpoints


// Get all guides
// Endpoint: GET /listings/guides/
// Public endpoint, no authentication required
export const getGuides = async()=>{
    const response = await axiosInstance.get(
        "/listings/guides/"
    );

    return response.data;
};


// Create guide profile
// Endpoint: POST /listings/guides/create/
// Requires JWT token
// Only users with guide role can create
export const createGuideProfile = async(data)=>{
    const response = await axiosInstance.post(
        "/listings/guides/create/",
        data
    );

    return response.data;
};


// Get all hotels
// Endpoint: GET /listings/hotels/
// Public endpoint, no authentication required
export const getHotels = async()=>{
    const response = await axiosInstance.get(
        "/listings/hotels/"
    );

    return response.data;
};


// Create hotel profile
// Endpoint: POST /listings/hotels/create/
// Requires JWT token
// Only users with hotel role can create
export const createHotelProfile = async(data)=>{
    const response = await axiosInstance.post(
        "/listings/hotels/create/",
        data
    );

    return response.data;
};


// Get all rooms
// Endpoint: GET /listings/rooms/
// Public endpoint, no authentication required
export const getRooms = async()=>{
    const response = await axiosInstance.get(
        "/listings/rooms/"
    );

    return response.data;
};


// Create room
// Endpoint: POST /listings/rooms/create/
// Requires JWT token
// Only hotel users can create rooms
export const createRoom = async(data)=>{
    const response = await axiosInstance.post(
        "/listings/rooms/create/",
        data
    );

    return response.data;
};


// Get all packages
// Endpoint: GET /listings/packages/
// Public endpoint, no authentication required
export const getPackages = async()=>{
    const response = await axiosInstance.get(
        "/listings/packages/"
    );

    return response.data;
};


// Create package
// Endpoint: POST /listings/packages/create/
// Requires JWT token
// Only guide users can create packages
export const createPackage = async(data)=>{
    const response = await axiosInstance.post(
        "/listings/packages/create/",
        data
    );

    return response.data;
};