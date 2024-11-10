import React, { useEffect, useState } from 'react';
import axios from 'axios';
import instance from "../../axiosConfig";
import './EBillTable.css';
import BillUpload from "./BillUpload";

const EbillTable = () => {
    const [ebills, setEbills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const openPopup = () => setIsPopupVisible(true);
    const closePopup = () => setIsPopupVisible(false);

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

    // Fetch e-bill data on component mount
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

    // Handler to clear all e-bill records
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

    return (
        <div>
            <h1>Document Library</h1>
            <div className="button-container">
                <button className="upload-button" onClick={openPopup}>Upload Bill</button>
                <button className="clear-button" onClick={clearEbills} disabled={loading}>
                    Clear All
                </button>
            </div>
        <div className="container">
            {/* Popup for Bill Upload */}
            {isPopupVisible && (
                <div className="overlay">
                    <BillUpload onClose={closePopup} />
                </div>
            )}



            {/* Table or Loading indicator */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="ebill-table">
                    <thead>
                    <tr>
                        <th>Account Number</th>
                        <th>Issue Date</th>
                        <th>Bill Period</th>
                        <th>Doc Type</th>
                        <th>Consumption</th>
                        <th>Total Cost</th>
                        <th>Carbon Footprint</th>
                        <th>Unit Cost</th>
                        <th>File</th>
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
                                <td>{bill.consumption}</td>
                                <td>{bill.totalCost}</td>
                                <td>{bill.carbonFootPrint}</td>
                                <td>{parseFloat(bill.costForKW/1000).toFixed(2)}</td>
                                <td>
                                    {/* Button to trigger PDF download */}
                                    <button className="view-button" onClick={() => downloadPdf(bill.fileLocation)}>View</button>
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
            )}
        </div>
        </div>
    );
}

export default EbillTable;
