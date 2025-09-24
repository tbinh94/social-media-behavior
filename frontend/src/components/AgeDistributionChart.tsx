import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartData } from 'chart.js';
import {ApiChartDataPoint} from '../types' // <-- Import kiểu dữ liệu chung
import ChartCard from './ChartCard';

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgeDistributionChart: React.FC = () => {
    // Định kiểu cho state. ChartData<'bar'> là kiểu dữ liệu mà component <Bar> mong đợi.
    // Bắt đầu với `null` để xử lý trạng thái loading.
    const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Dùng generic để báo cho axios biết chúng ta mong đợi một mảng ApiChartDataPoint[]
        axios.get<ApiChartDataPoint[]>('http://127.0.0.1:8000/api/age-distribution')
            .then(response => {
                const data = response.data;
                
                // TypeScript sẽ tự động gợi ý `item.label` và `item.count` ở đây
                setChartData({
                    labels: data.map(item => item.label),
                    datasets: [{
                        label: 'Số lượng người dùng',
                        data: data.map(item => item.count),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(err => {
                setError("Không thể tải dữ liệu phân bổ độ tuổi.");
                console.error(err);
            });
    }, []);
    
    return (
        <ChartCard title="Phân bổ người dùng theo độ tuổi">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!chartData && !error && <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>}
            {chartData && <Bar data={chartData} options={{ maintainAspectRatio: false }} />}
        </ChartCard>
    );
};

export default AgeDistributionChart;