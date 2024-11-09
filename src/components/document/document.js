import React, { useState, useEffect } from 'react';
import './Customers.css';

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    // Simulate fetching customer data
    useEffect(() => {
        const fetchCustomers = async () => {
            // Simulating an API call with dummy data
            const customerData = [
                { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
                { id: 3, name: 'Sam Brown', email: 'sam@example.com', phone: '555-555-5555' },
                { id: 4, name: 'Lucy Green', email: 'lucy@example.com', phone: '333-333-3333' },
            ];
            setCustomers(customerData);
        };

        fetchCustomers();
    }, []);

    return (
        <div className="customers-section">
            {/* Header with Title */}
            <div className="header">
                <h1 className="header-title">Customer List</h1>
            </div>

            {/* Button Section */}
            <div className="button-section">
                <button className="btn">Add Customer</button>
                <button className="btn">Export Data</button>
            </div>

            {/* Table to Display Customers */}
            <table className="customers-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Download</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                            <a href={`#`} download={`Customer-${customer.id}.pdf`}>
                                Download
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Customers;
