import React, {useEffect, useState} from 'react';
import './Header.css'; // Import CSS for header styling
import { Link } from 'react-router-dom';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );

    // Effect to listen for changes in localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
            setUserName(localStorage.getItem("userName") || "");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);   // Update state if localStorage changes

    return (
        <div className="menu">
            <h2>Menu</h2>
            <ul>
                <li><Link to="/barChart"></Link></li>
                <li><Link to="/billUpload"></Link></li>
                <li><Link to="/logout"></Link></li>
                <li><Link to="/eBillTable"></Link></li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default Header;
