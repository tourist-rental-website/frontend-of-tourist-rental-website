import axiosInstance from "./axiosInstance";

// Chat API functions
// Handles conversation and message-related REST endpoints


// Create a new conversation with a hotel
// Endpoint: POST /chat/conversations/create/
// Requires JWT authentication
export const createConversation = async(hotel_id)=>{
    const response = await axiosInstance.post(
        "/chat/conversations/create/",
        {hotel_id}
    );

    return response.data;
};


// Get all conversations of logged-in user
// Endpoint: GET /chat/conversations/
// Requires JWT authentication
export const getConversations = async()=>{
    const response = await axiosInstance.get(
        "/chat/conversations/"
    );

    return response.data;
};


// Get single conversation details
// Endpoint: GET /chat/conversations/<id>/
export const getConversation = async(id)=>{
    const response = await axiosInstance.get(
        `/chat/conversations/${id}/`
    );

    return response.data;
};


// Send message in a conversation
// Endpoint: POST /chat/conversations/<id>/send_message/
// Body: {content}
export const sendMessage = async(id, content)=>{
    const response = await axiosInstance.post(
        `/chat/conversations/${id}/send_message/`,
        {content}
    );

    return response.data;
};


// Mark a message as read
// Endpoint: POST /chat/conversations/<id>/mark_as_read/
// Body: {message_id}
export const markAsRead = async(id, message_id)=>{
    const response = await axiosInstance.post(
        `/chat/conversations/${id}/mark_as_read/`,
        {message_id}
    );

    return response.data;
};


// Get all messages in a conversation
// Endpoint: GET /chat/conversations/<id>/messages/
export const getMessages = async(id)=>{
    const response = await axiosInstance.get(
        `/chat/conversations/${id}/messages/`
    );

    return response.data;
};