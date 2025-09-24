import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import type { ApiChartDataPoint } from '../types';
import ChartCard from './ChartCard';
ChartJS.register(ArcElement, Tooltip, Legend);
const OccupationChart: React.FC = () => {
const [chartData, setChartData] = useState<ChartData<'doughnut'> | null>(null);
const [error, setError] = useState<string>('');
useEffect(() => {
    axios.get<ApiChartDataPoint[]>('http://127.0.0.1:8000/api/occupation-distribution')
        .then(response => {
            const data = response.data;
            setChartData({
                labels: data.map(item => item.label),
                datasets: [{
                    label: 'Số lượng người dùng',
                    data: data.map(item => item.count),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                        '#9966FF', '#FF9F40', '#C9CBCF'
                    ],
                }]
            });
        })
        .catch(err => {
            setError("Không thể tải dữ liệu nghề nghiệp.");
            console.error(err);
        });
}, []);

return (
        <ChartCard title="Phân bổ người dùng theo nghề nghiệp">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!chartData && !error && <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>}
            {chartData && <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />}
        </ChartCard>
    );
};
export default OccupationChart;