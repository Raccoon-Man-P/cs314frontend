// src/pages/MainPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser, updateUserProfile } from '../services/api';
import '../components/MainPage.css';

const MainPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('#ffffff');  // Default color (white)
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfo();
                setUserEmail(userData.email);
                setFirstName(userData.firstName || '');
                setLastName(userData.lastName || '');
                setColor(userData.color || ''); // Set the color if available
            } catch (err) {
                setError('Failed to load user info. Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/'); // Redirect to login page
        } catch (err) {
            setError('Logout failed. Please try again.');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile({ firstName, lastName, color });
            setSuccess('Profile updated successfully!');
            setShowUpdateForm(false); // Hide form after successful update
        } catch (err) {
            setError('Failed to update profile. Try again.');
        }
    };

    return (
        <div className="main-container">
            {loading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                        <div className="profile-card">
                            <h2>Welcome, {firstName} {lastName}!</h2>
                    <p>Email: {userEmail}</p>

                    {/* Update Profile Button */}
                    {!showUpdateForm ? (
                        <button onClick={() => setShowUpdateForm(true)} className="update-btn">
                            Update User Profile
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="update-form">
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />

                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />

                            <label>Profile Color:</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />

                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)} className="cancel-btn">Cancel</button>
                        </form>
                    )}

                    {success && <p className="success-message">{success}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            )}
        </div>
    );
};

export default MainPage;
