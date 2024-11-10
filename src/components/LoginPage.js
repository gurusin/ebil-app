import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file
import instance from "../axiosConfig";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post('/api/login', {
                    username: username,
                    password: password,
            });

            // Assuming successful login returns a token or user details
            if (response.status === 200) {
                // Store user info in localStorage or state management
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('userName',response.data.username);
                localStorage.setItem("isLoggedIn","true");
                console.log(response.data);

                // Redirect to the home page or dashboard
                navigate('/barChart'); // Navigate to home page after login
            }
        } catch (error) {
            // Handle error response
        }
    };


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>

                {/* Registration link */}
                <p className="register-link">
                    Don't have an account?{' '}
                    <span
                        className="register-link-text"
                        onClick={() => navigate('/register')}
                    >
                        Please register
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
