import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const apiClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true, // Send/receive cookies
});

// Helper function to handle errors
const handleError = (error) => {
    if (error.response) {
        console.error('Error response:', error.response.data);
        return Promise.reject(error.response.data);
    } else if (error.request) {
        console.error('Error request:', error.request);
        return Promise.reject('No response from server');
    } else {
        console.error('Error message:', error.message);
        return Promise.reject(error.message);
    }
};

export const signup = async (userData) => {
    try {
        const response = await apiClient.post(`${SERVER_URL}/api/auth/signup`, userData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const login = async (userData) => {
    try {
        const response = await apiClient.post(`${SERVER_URL}/api/auth/login`, userData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post(`${SERVER_URL}/api/auth/logout`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const response = await apiClient.get(`${SERVER_URL}/api/auth/userinfo`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const updateUserProfile = async (requestData) => {
    try {

        await apiClient.post(
            `${SERVER_URL}/api/auth/update-profile`,
            requestData,
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const searchContacts = async (searchTerm) => {
    try {
        const response = await apiClient.post(
            `${SERVER_URL}/api/contacts/search`,
            { searchTerm },  
            { withCredentials: true }  
        );
        return response.data;  
    } catch (error) {
        console.error('Error searching contacts:', error);
        throw error;  
    }
};

export const getAllContacts = async () => {
    try {
        const response = await apiClient.get(`${SERVER_URL}/api/contacts/all-contacts`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        throw error;
    }
};

export const getContactsForList = async () => {
    try {
        const response = await apiClient.get(`${SERVER_URL}/api/contacts/get-contacts-for-list`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving sorted contacts:', error);
        throw error;
    }
};

export const getMessages = async (contactorId) => {
    try {
        const response = await apiClient.post(`${SERVER_URL}/api/messages/get-messages`, { id: contactorId }, { withCredentials: true });
        return response.data.messages;
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
};


