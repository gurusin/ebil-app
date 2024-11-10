import React, {useEffect, useRef, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import instance from "../../axiosConfig";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function ConsumptionBarChart() {
    const chartRef = useRef(null);
    const image = new Image();
    image.src = `${process.env.PUBLIC_URL}/logo.jpeg`;
    image.onload = () => {
    };
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Electricity Consumption (kWh)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        // Fetch data from the backend
        instance.get('/api/consumption')
            .then(response => {
                // Use response data to set chart labels and dataset
                const labels = response.data.map(item => item.issueDate);
                const consumptionData = response.data.map(item => item.consumption);
                const costPerUnit = response.data.map(item => item.costForKW);
                const carbonFootPrint = response.data.map(item => item.carbonFootPrint);


                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Electricity Consumption (kWh)',
                            data: consumptionData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Cost Per Unit',
                            data: costPerUnit,
                            backgroundColor: 'rgba(15,6,47,0.57)',
                            borderColor: 'rgba(15,6,47,0.57)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Carbon Footprint',
                            data: carbonFootPrint,
                            backgroundColor: 'rgb(255,0,0)',
                            borderColor: 'rgb(255,0,0)',
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'amount',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Period',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
        },
    };

    const downloadChart = () => {
        const input = document.getElementById('myChart');

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();

                // Calculate width and height for the PDF
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                // Add the image to the PDF
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('chart.pdf'); // Download the PDF
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };

    return (
        <div>
            <a href="#" onClick={downloadChart} style={{ marginTop: '20px',
                textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
                Download Chart
            </a>
        <div id='myChart' style={{ width: '600px', height: '400px' }}>
            <h2>Monthly Electricity Consumption</h2>
            <Bar ref={chartRef} data={chartData} options={options} />
        </div>
        </div>
    );
}

export default ConsumptionBarChart;
