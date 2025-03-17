// src/services/api.js
import axios from 'axios';

// Get the SERVER_URL from the .env file
const SERVER_URL = import.meta.env.VITE_SERVER_URL; // assuming your .env uses VITE_ prefix

const apiClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true, // Send/receive cookies
});

// Helper function to handle errors
const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response:', error.response.data);
        return Promise.reject(error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        return Promise.reject('No response from server');
    } else {
        // Something happened in setting up the request that triggered an Error
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
        const response = await axios.post(`${SERVER_URL}/api/auth/logout`, { withCredentials: true });
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

export const updateUserProfile = async ({ firstName, lastName, color }) => {
    try {
        await axios.post(
            `${SERVER_URL}/api/auth/update-profile`,
            { firstName, lastName, color },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
