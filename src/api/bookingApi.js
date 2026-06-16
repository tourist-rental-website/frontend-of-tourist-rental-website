import axiosInstance from "./axiosInstance";

// Booking API functions
// Handles room and package booking operations


// Create room booking
// Endpoint: POST /booking/room-booking/
// Requires JWT authentication
export const createRoomBooking = async(data)=>{
    const response = await axiosInstance.post(
        "/booking/room-booking/",
        data
    );

    return response.data;
};


// Create package booking
// Endpoint: POST /booking/package-booking/
// Requires JWT authentication
export const createPackageBooking = async(data)=>{
    const response = await axiosInstance.post(
        "/booking/package-booking/",
        data
    );

    return response.data;
};


// Get logged-in user's room bookings
// Endpoint: GET /booking/my-room-bookings/
// Requires JWT authentication
export const getMyRoomBookings = async()=>{
    const response = await axiosInstance.get(
        "/booking/my-room-bookings/"
    );

    return response.data;
};


// Get logged-in user's package bookings
// Endpoint: GET /booking/my-package-bookings/
// Requires JWT authentication
export const getMyPackageBookings = async()=>{
    const response = await axiosInstance.get(
        "/booking/my-package-bookings/"
    );

    return response.data;
};


// Cancel room booking
// Endpoint: PATCH /booking/room-bookings/<id>/cancel/
// Requires JWT authentication
export const cancelRoomBooking = async(id)=>{
    const response = await axiosInstance.patch(
        `/booking/room-bookings/${id}/cancel/`
    );

    return response.data;
};


// Cancel package booking
// Endpoint: PATCH /booking/package-bookings/<id>/cancel/
// Requires JWT authentication
export const cancelPackageBooking = async(id)=>{
    const response = await axiosInstance.patch(
        `/booking/package-bookages/${id}/cancel/`
    );

    return response.data;
};