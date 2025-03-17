import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser, updateUserProfile } from '../services/api';
import SearchContacts from '../components/SearchContacts';
import ChatWindow from '../components/ChatWindow';
import '../components/MainPage.css';

const MainPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [userId, setUserId] = useState(''); // New state to store user ID
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfo();
                setUserEmail(userData.email);
                setFirstName(userData.firstName || '');
                setLastName(userData.lastName || '');
                setColor(userData.color || '#ffffff');
                setUserId(userData.id); // Store the logged-in user's ID
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

        if (!firstName || !lastName) {
            setError('First Name and Last Name are required.');
            return;
        }

        try {
            await updateUserProfile({ firstName, lastName, color });
            setSuccess('Profile updated successfully!');
            setShowUpdateForm(false);
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

                    {!showUpdateForm ? (
                        <button onClick={() => setShowUpdateForm(true)} className="update-btn">
                            Update User Profile
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="update-form">
                            <label>First Name (required):</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

                            <label>Last Name (required):</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

                            <label>Profile Color (optional):</label>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)} className="cancel-btn">Cancel</button>
                        </form>
                    )}

                    {success && <p className="success-message">{success}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            )}

            <SearchContacts onSelectContact={setSelectedContact} />

            <div className="chat-container">
                <ChatWindow selectedContact={selectedContact} userId={userId} />
            </div>
        </div>
    );
};

export default MainPage;
