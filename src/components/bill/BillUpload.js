import React, { useState, useEffect } from 'react';
import './BillUpload.css';
import instance from "../../axiosConfig";
import { useNavigate } from 'react-router-dom';

const BillUpload = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [billData, setBillData] = useState(null);  // For storing the bill data from the backend
    const [documentType, setDocumentType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal for confirmation
    const navigate = useNavigate();


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setMessage('');
        } else {
            setMessage('Please upload a valid PDF file.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        if (documentType !== 'Electricity Bill') {
            setMessage('Unsupported document type. Only "Electricity Bill" is supported.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('DocType',documentType )
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await instance.post('api/pdf/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setMessage('Bill uploaded successfully!');
                setBillData(response.data);
                setIsModalOpen(true); // Open the first modal after receiving the data
            } else {
                setMessage('Failed to upload the bill. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('An error occurred while uploading the bill {'+ error.response.data+"}");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBillData((prevBillData) => ({
            ...prevBillData,
            [name]: value
        }));
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await instance.patch('api/pdf/update-bill', billData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.status === 200) {
                setMessage('Bill updated successfully!');
                onClose(); // Close the dialog after successful update
                setIsConfirmModalOpen(false); // Close the confirm modal
            } else {
                setMessage('Failed to update the bill. Please try again.');
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            setMessage('An error occurred while updating the bill.');
            setIsConfirmModalOpen(false); // Close the confirm modal
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsConfirmModalOpen(false); // Close the confirm modal
    };

    function abortUpdate() {
        setIsModalOpen(false);
    }

    return (
        <div className="upload-bill">
            <div className='modal'>
                <div className="modal-content">
                    <button onClick={onClose}>Close</button>
                    <h2>Upload Your Document</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Document Type</label>
                            <select
                                name="documentType"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            >
                                <option value="">Select Document Type</option>
                                <option value="Electricity Bill">Electricity Bill</option>
                                <option value="Water Bill">Water Bill</option>
                                <option value="Gas Bill">Gas Bill</option>
                                <option value="Phone Bill">Phone Bill</option>
                                <option value="Internet Bill">Internet Bill</option>
                            </select>
                        </div>

                        <div>
                            <label>Upload PDF</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type="submit" disabled={loading}>Upload</button>
                        {loading && <p className="loading">Uploading...</p>}
                        {message && <p className="message">{message}</p>}
                    </form>
                </div>
            </div>

            {/* First Popup Modal: Editable Fields */}
            {billData && !loading && isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Document Information</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={billData.accountNumber || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Service Address</label>
                                    <input
                                        type="text"
                                        name="serviceAddress"
                                        value={billData.serviceAddress || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Issue Date</label>
                                    <input
                                        type="text"
                                        name="issueDate"
                                        value={billData.issueDate || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Document Period</label>
                                    <input
                                        type="text"
                                        name="billingPeriod"
                                        value={billData.billingPeriod || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>NMI</label>
                                    <input
                                        type="text"
                                        name="nmi"
                                        value={billData.nmi || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Consumption (KWh)</label>
                                    <input
                                        type="number"
                                        name="consumption"
                                        value={billData.consumption.toFixed(2) || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Cost</label>
                                    <input
                                        type="number"
                                        name="totalCost"
                                        value={billData.totalCost.toFixed(2) || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carbon Footprint</label>
                                    <input
                                        type="number"
                                        name="carbonFootPrint"
                                        value={billData.carbonFootPrint.toFixed(2) || ''}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Cost per KW</label>
                                    <input
                                        type="number"
                                        name="costForKW"
                                        value={billData.costForKW.toFixed(2) || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            <button type="button" onClick={() => handleConfirm()} disabled={loading}>
                                Confirm & Submit
                            </button>
                            <button type="button" onClick={() => abortUpdate()} disabled={loading}>
                                Abort
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillUpload;
