// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api'; // Import the login function
//import './Login.css'; // You can create your custom styles here

function SignUpButton() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/signup')
    };

    return (
        <button onClick={handleClick}>
            Sign Up
        </button>
    );
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const userCredentials = { email, password };
            const response = await login(userCredentials);

            // Assuming the response contains a JWT token or user data
            if (response) {
                // Redirect user to the main page after successful login
                navigate('/main');
            }

        }
        catch (err) {
            setError(JSON.stringify(err, null, 2));
        }
    };

    return (
        <div className="login-container">
            <h2>Login to ChatSmart</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">Login</button>
                {SignUpButton()}
            </form>
        </div>
    );
};

export default Login;
