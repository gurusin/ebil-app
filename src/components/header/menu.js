import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    // Update state if localStorage changes
    const [userName] = useState(() => {
        return localStorage.getItem('userName');
    });
    return (
        <div className="menu">
               <h2>Welcome {userName}</h2>
            <ul>
                <li><Link to="/barChart">Home</Link></li>
                <li><Link to="/eBillTable">Document Library</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/logout">Logout</Link></li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default Menu;
