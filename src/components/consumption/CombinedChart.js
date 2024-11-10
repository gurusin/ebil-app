import React, {useRef, useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logo from './logo.jpeg'; // Place the logo image in the same directory as the component
import "./CombinedChart.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
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

const MultiChartComponent = () => {
    const chartRefs = [useRef(null), useRef(null), useRef(null)];
    const [data, setData] = useState([]);
    // Fetch data on component mount
    useEffect(() => {
        const fetchData =() =>{
            instance.get('/api/consumption')
                .then(response =>{setData(response.data)});
        }
        fetchData();
    }, []);

    const emissionFactor = {
        labels : data.map(item => item.issueDate),
        datasets: [
            {
                data: data.map(item => item.carbonFootPrint),
                backgroundColor: 'rgba(158,231,98,0.65)',
                borderColor: 'rgba(158,231,98,0.50)',
                borderWidth: 1
            }
        ]
    };

    const consumptionData = {
        labels : data.map(item => item.issueDate),
        datasets: [
            {
                data: data.map(item => item.consumption),
                backgroundColor: 'rgba(0, 166, 175, 0.6)',
                borderColor: 'rgba(0, 166, 175,0.87)',
                borderWidth: 1
            }
        ],
        plugins:{
            legend: {
                display: false,
            },
        },
    };

    const costIntesity = {
        labels : data.map(item => item.issueDate),
        datasets: [
            {
                data: data.map(item => item.costForKW/1000),
                backgroundColor: 'rgba(22, 110, 112, 0.6)',
                borderColor: 'rgba(22, 110, 112,0.87)',
                borderWidth: 1
            }
        ],
        plugins:{
            legend: {
                display: false,
            },
        },
    };


    const chartOptsEmission = {
        responsive: true,
        maintainAspectRatio: true, // Allow flexible height
        plugins: {
            title: {
                display: false,
            },
            legend :{
                display: false,
                labels :{font:{weight:'bold'}}
            },
        },
        scales:{
            x:{ ticks:{font:{weight:'bold'}}},
            y:{
                ticks:{font:{weight:'bold'}},
                title: {
                    display: true,
                    text: 'Scope 2 Emissions (kg CO₂e)', // Base title for Y-axis; can override per chart
                    font:{weight:'bold'},
                },
            }
        }
    };
    const cartOptsCostIntensity = {
        responsive: true,
        maintainAspectRatio: true, // Allow flexible height
        plugins: {
            title: {
                display: false,
            },
            legend :{
                display: false,
                labels :{font:{weight:'bold'}}
            },
        },
        scales:{
            x:{ ticks:{font:{weight:'bold'}}},
            y:{
                ticks:{font:{weight:'bold'}},
                title: {
                    display: true,
                    text: 'Cost Per KWh($)', // Base title for Y-axis; can override per chart
                    font:{weight:'bold'},
                },
            }
        }
    };
    const chartOptsConsumption = {
        responsive: true,
        maintainAspectRatio: true, // Allow flexible height
        plugins: {
            title: {
                display: false,
            },
            legend :{
                display: false,
                labels :{font:{weight:'bold'}}
            },

        },
        scales:{
            x:{ticks:{font:{weight:'bold'}}},
            y:{
                ticks:{font:{weight:'bold'}},
                title: {
                    display: true,
                    text: 'Consumption (KWh)',
                    font:{weight:'bold'},
                },
            }
        }
    };

    const downloadPDF2 = () => {
        const pdf = new jsPDF('p', 'pt', 'a4');

        // Define some constants for easier alignment adjustments
        const leftMargin = 20;         // Margin for left-aligned text
        const rightMargin = 20;        // Right margin for logo
        const pageWidth = pdf.internal.pageSize.width;
        const logoWidth = 204;         // Adjust width to fit the desired size
        const logoHeight = 36;         // Adjust height proportionally to width
        const textTopPosition = 40;    // Vertical alignment for text and logo

        // Add header text aligned to the top left
        pdf.text("Electricity Consumption Report", leftMargin, textTopPosition);

        // Position logo at the top right with a right margin
        pdf.addImage(
            logo, 'JPEG',
            pageWidth - logoWidth - rightMargin,  // Align to the right
            textTopPosition - logoHeight / 2,     // Align vertically with text
            logoWidth,
            logoHeight
        );

        // Add the chart
        html2canvas(document.querySelector("#chartContainer")).then(canvas => {
            pdf.addImage(
                canvas.toDataURL("image/png"),
                "PNG",
                20,
                150,
                580,
                400
            );
            pdf.save("charts.pdf");
        });
    };

    const downloadPDF = () => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.text("Electricity Consumption Report", 20, 20);
        pdf.addImage(logo, 'JPEG', 20, 30, 204, 36);

        html2canvas(document.querySelector("#chartContainer")).then(canvas => {
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 20, 150, 580, 400);
            pdf.save("charts.pdf");
        });
    };

    return (
        <div >
            <h1>Dashboard</h1>
            <div className="download-link-container">
                <button className="download-button" onClick={downloadPDF2}>
                    Download PDF
                </button>
            </div>
            <div  id="chartContainer" className="chart-section">
                <div className="chart-container">
                    <h3>Total Units Consumed</h3>
                    <Bar ref={chartRefs[2]} data={consumptionData} options={chartOptsConsumption} />
                </div>
                <div className="chart-container">
                    <h3>Total Scope 2 Emissions (kg CO₂e)</h3>
                    <Bar ref={chartRefs[0]} data={emissionFactor} options={chartOptsEmission}/>
                </div>
                <div className="chart-container">
                    <h3>Cost Intensity</h3>
                    <Bar ref={chartRefs[1]} data={costIntesity} options={cartOptsCostIntensity} />

                </div>


            </div>
        </div>
    );
};

export default MultiChartComponent;
