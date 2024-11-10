import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Clear authentication data (like JWT token)
        localStorage.removeItem('token'); // Change this according to how you're storing the token
        sessionStorage.removeItem('token'); // If you're using session storage
        localStorage.removeItem('username');
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <div>
            <h2>Are you sure you want to log off?</h2>
            <button onClick={handleLogout}>Log Off</button>
        </div>
    );
};

export default Logout;
