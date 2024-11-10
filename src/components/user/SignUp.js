import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './SignUp.css';
import instance from '../../axiosConfig';

const RegisterUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState(''); // For success/error message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await instance.post('/api/register', formData); // Await the response
            if (response.status === 200 || response.status === 201) {
                // Optionally clear the form and navigate to login on successful registration
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 500); // Redirect to login after a short delay
            } else {
                setMessage('Registration failed. Please try again.' + response.data);
            }
        } catch (error) {
            console.error("Error registering user:", error);
            const errorData = error.response.data;
            setMessage('Registration failed. Please check your details and try again ==> ' + errorData);
        }
    };

    return (
        <div className="register-container">
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>} {/* Display success or error message */}
            {/* Link to login page */}
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default RegisterUser;
