import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const Chart = ({ data }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data && data.length > 0) {
            setLoading(false);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const chartData = {
        labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Price',
                data: data.map(d => d.price),
                fill: false,
                borderColor: 'black',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        const price = context.parsed.y.toFixed(3);
                        const date = context.parsed.x;
                        return `Date: ${date}\nPrice: £${price}`;
                    }
                }
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
    };

    const containerStyle = {
        width: '200px',  // Adjust the width as needed
        height: '100px',  // Adjust the height as needed
    };

    return (
        <div style={containerStyle}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default Chart;
