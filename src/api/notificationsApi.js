import axiosInstance from "./axiosInstance";

// Notifications API functions
// Handles all notification-related endpoints


// Get all notifications for current user
// Endpoint: GET /notifications/
export const getNotifications = async()=>{
    const response = await axiosInstance.get(
        "/notifications/"
    );

    return response.data;
};


// Get unread notifications only
// Endpoint: GET /notifications/unread/
export const getUnreadNotifications = async()=>{
    const response = await axiosInstance.get(
        "/notifications/unread/"
    );

    return response.data;
};


// Mark single notification as read
// Endpoint: PATCH /notifications/<id>/read/
export const markAsRead = async(id)=>{
    const response = await axiosInstance.patch(
        `/notifications/${id}/read/`
    );

    return response.data;
};


// Mark all notifications as read
// Endpoint: PATCH /notifications/read-all/
export const markAllAsRead = async()=>{
    const response = await axiosInstance.patch(
        "/notifications/read-all/"
    );

    return response.data;
};


// Delete a notification
// Endpoint: DELETE /notifications/<id>/delete/
export const deleteNotification = async(id)=>{
    const response = await axiosInstance.delete(
        `/notifications/${id}/delete/`
    );

    return response.data;
};


// Get unread notifications count
// Endpoint: GET /notifications/count/unread/
export const getUnreadCount = async()=>{
    const response = await axiosInstance.get(
        "/notifications/count/unread/"
    );

    return response.data;
};