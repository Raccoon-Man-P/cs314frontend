import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage.jsx'; // Assuming this is your main page after login
import Signup from './pages/Signup';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
};

export default App;
