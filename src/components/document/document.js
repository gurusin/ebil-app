import React, { useState, useEffect } from 'react';
import './document.css';
import instance from "../../axiosConfig";
import BillUpload from "../bill/BillUpload";

const Document = () => {
    const [customers, setCustomers] = useState([]);
    const [ebills, setEbills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const openPopup = () => setIsPopupVisible(true);
    const closePopup = () => {
        setIsPopupVisible(false);
        fetchEbills();
    }

    const clearEbills = async () => {
        setLoading(true);
        try {
            await instance.post('/api/consumption/clear'); // Replace with your delete API endpoint
            setEbills([]); // Clear the data from state after deletion
        } catch (error) {
            console.error('Error deleting e-bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (blobName) => {
        try {
            // Make a GET request to your Spring Boot controller
            const response = await instance.get(`/api/pdf/download?blobName=${blobName}`, {
                responseType: 'blob',
            });

            // Convert the response to a Blob (binary data)
            const blob = response.data;
            // Create a URL for the Blob object
            const url = window.URL.createObjectURL(blob);

            // Open the Blob in a new tab
            const newTab = window.open(url, '_blank');
            if (newTab) {
                newTab.focus(); // Focus on the new tab
            }
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        }
    };

    useEffect(() => {
        fetchEbills();
    }, []);

    const fetchEbills = async () => {
        setLoading(true);
        try {
            const response = await instance.get('/api/consumption'); // Replace with your API endpoint
            setEbills(response.data);
        } catch (error) {
            console.error('Error fetching e-bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeDocument = async (id) => {
        await instance.delete("api/document?id="+id);
        fetchEbills();
    }

    return (
        <div className="customers-section">
            {isPopupVisible && (
                <div className="overlay">
                    <BillUpload onClose={closePopup} />
                </div>
            )}
            {/* Header with Title */}
            <div className="header">
                <h1 className="header-title">Document Library</h1>
            </div>

            {/* Button Section */}
            <div className="button-section">
                <button className="btn-del" onClick={clearEbills}>Clear All</button>
                <button className="btn" onClick={openPopup}>Upload PDF</button>
            </div>

            {/* Table to Display Document */}
            <table className="customers-table">
                <thead>
                <tr>
                    <th>Account Number</th>
                    <th>Issue Date</th>
                    <th>Document Period</th>
                    <th>Document Type</th>
                    <th>Consumption (KWh)</th>
                    <th>Total Cost (AU$)</th>
                    <th>Carbon Footprint (kg CO₂e)</th>
                    <th>Unit Cost</th>
                    <th colSpan={2}>File</th>
                </tr>
                </thead>
                <tbody>
                {ebills.length > 0 ? (
                    ebills.map((bill) => (
                        <tr key={bill.id}>
                            <td>{bill.accountNumber}</td>
                            <td>{bill.issueDate}</td>
                            <td>{bill.billingPeriod}</td>
                            <td>{bill.documentType}</td>
                            <td>{bill.consumption.toFixed(2)}</td>
                            <td>{bill.totalCost.toFixed(2)}</td>
                            <td>{bill.carbonFootPrint.toFixed(2)}</td>
                            <td>{parseFloat(bill.costForKW/1000).toFixed(2)}</td>
                            <td>
                                <button className="view-button" onClick={() => downloadPdf(bill.fileLocation)}>View</button>
                            </td>
                            <td>
                                <button className="del-button" onClick={() => removeDocument(bill.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="no-records">No records found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Document;
