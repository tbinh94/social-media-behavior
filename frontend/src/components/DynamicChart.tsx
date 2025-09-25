import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import type { ApiChartDataPoint } from '../types';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface DynamicChartProps {
  columnKey: string;
  columnName: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ columnName, columnKey }) => {
  const [chartData, setChartData] = useState<ChartData<'bar' | 'pie'> | null>(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie');

  useEffect(() => {
    if (!columnKey) return;

    setChartData(null);
    setError('');

    axios.get<ApiChartDataPoint[]>(`http://127.0.0.1:8000/api/analyze/${columnKey}`)
      .then(response => {
        const data = response.data;
        
        // Quyết định loại biểu đồ: Nếu ít hơn 7 loại, dùng biểu đồ tròn, ngược lại dùng biểu đồ cột.
        const newChartType = data.length <= 7 ? 'pie' : 'bar';
        setChartType(newChartType);

        setChartData({
          labels: data.map(item => item.label),
          datasets: [{
            label: `Count of ${columnName}`,
            data: data.map(item => item.count),
            backgroundColor: newChartType === 'pie' ? [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
              '#9966FF', '#FF9F40', '#C9CBCF'
            ] : 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        });
      })
      .catch(err => {
        const errorMessage = err.response?.data?.detail || `Could not analyze column: ${columnName}`;
        setError(errorMessage);
      });
  }, [columnKey]); // Effect này sẽ chạy lại mỗi khi `columnName` thay đổi.

  if (!columnName) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-full">
        <p className="text-gray-500">Please select a column to visualize.</p>
      </div>
    );
  }

  return (
    <ChartCard title={`Analysis for: ${columnName}`}>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!chartData && !error && <p className="text-gray-500 text-center">Loading analysis...</p>}
      {chartData && chartType === 'bar' && <Bar data={chartData as ChartData<'bar'>} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />}
      {chartData && chartType === 'pie' && <Pie data={chartData as ChartData<'pie'>} options={{ maintainAspectRatio: false }} />}
    </ChartCard>
  );
};

export default DynamicChart;