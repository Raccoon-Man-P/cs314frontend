// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { signup } from '../services/api'; 

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(''); 

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const userData = { email, password };
            const response = await signup(userData);

            if (response) {
                navigate('/');
            }
        } catch (err) {
            setError(JSON.stringify(err, null, 2));
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up for Chat App</h2>
            <form onSubmit={handleSignup}>
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
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/">Log in</Link></p>
            </div>
        </div>
    );
};

export default Signup;
