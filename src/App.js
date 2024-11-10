import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate, Link} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BillUpload from "./components/bill/BillUpload";
import Logout from "./components/login/LogOut";
import MultiChartComponent from "./components/consumption/CombinedChart";
import Menu from "./components/header/menu";
import './App.css';
import RegisterUser from "./components/user/SignUp";
import EbillTable from "./components/bill/EBillTable";
import Customers from "./components/test/Customers";
import Document from "./components/document/document";


const App = () => {
    const isAuthenticated = () => {
        return localStorage.getItem('isLoggedIn') === true; // Example check
    };

    return (
        <Router>
        <div className="app-container">

            <header className="header">
                    <img src="logo.jpeg"/>
            </header>
            <div className="main-content">
                <aside className="sidebar">
                    <ul>
                        <li><Link to="/barChart">Home</Link></li>
                        <li><Link to="/document">Document Library</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                        {/* Add more links as needed */}
                    </ul>
                </aside>
                <section className="content">

                    <Routes>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterUser/>}/>
                        <Route path="/billUpload" element={<BillUpload/>}/>
                        <Route path="/barChart" element={<MultiChartComponent/>}/>
                        <Route path="/eBillTable" element={<EbillTable/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                        <Route path="/document" element={<Document/>}/>
                        <Route path="/"
                               element={isAuthenticated() ? <Navigate to="/barChart"/> : <Navigate to="login"/>}/>
                        {/* Add other routes as needed */}
                    </Routes>

                </section>
            </div>
        </div>
        </Router>
    );
};

export default App;
