import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import type { ApiChartDataPoint } from '../types';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupedDataset {
  label: string;
  data: number[];
}

interface DynamicChartProps {
  dimensionKey: string;
  dimensionDisplayName: string;
  breakdownKey: string;
  breakdownDisplayName: string;
}

// MỚI: State cho insight sẽ là một chuỗi ký tự đơn giản
const DynamicChart: React.FC<DynamicChartProps> = ({ dimensionKey, dimensionDisplayName, breakdownKey, breakdownDisplayName }) => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState<string>(''); // State lưu trữ insight

  useEffect(() => {
    if (!dimensionKey) return;

    setChartData(null);
    setError('');
    setInsight(''); // Reset insight

    const CHART_COLORS = [
      'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
    ];

    const isGroupedAnalysis = breakdownKey && breakdownKey !== dimensionKey;
    
    const fetchData = async () => {
      try {
        if (isGroupedAnalysis) {
          // --- Kịch bản 1: Phân tích chéo ---
          const endpoint = `http://127.0.0.1:8000/api/analyze-grouped?dimension_col=${dimensionKey}&breakdown_col=${breakdownKey}`;
          const response = await axios.get<{ labels: string[], datasets: GroupedDataset[] }>(endpoint);
          
          const { labels, datasets } = response.data;
          
          // --- Tính toán Insight cho Phân tích chéo ---
          let maxCount = -1;
          let dominantDimension = '';
          let dominantBreakdown = '';

          datasets.forEach(dataset => {
            dataset.data.forEach((count, index) => {
              if (count > maxCount) {
                maxCount = count;
                dominantDimension = dataset.label;
                dominantBreakdown = labels[index];
              }
            });
          });

          if (maxCount > 0) {
            setInsight(`The most common combination is **${dominantBreakdown}** in the **'${dimensionDisplayName}'** category, with **${dominantDimension}** being the most frequent response.`);
          }
          // ---------------------------------------------

          const coloredDatasets = datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
          }));

          setChartData({ labels, datasets: coloredDatasets });

        } else {
          // --- Kịch bản 2: Phân tích đơn ---
          const endpoint = `http://127.0.0.1:8000/api/analyze/${dimensionKey}`;
          const response = await axios.get<ApiChartDataPoint[]>(endpoint);
          const data = response.data;

          // --- Tính toán Insight cho Phân tích đơn ---
          if (data && data.length > 0) {
            const totalCount = data.reduce((sum, item) => sum + item.count, 0);
            const largestGroup = data[0]; // Dữ liệu từ API đã được sắp xếp giảm dần
            const percentage = ((largestGroup.count / totalCount) * 100).toFixed(1);
            setInsight(`The dominant category is **${largestGroup.label}**, accounting for **${percentage}%** of all responses.`);
          }
          // -------------------------------------------

          setChartData({
            labels: data.map(item => item.label),
            datasets: [{
              label: `Count of ${dimensionDisplayName}`,
              data: data.map(item => item.count),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
            }]
          });
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || `Could not perform analysis.`;
        setError(errorMessage);
      }
    };

    fetchData();
  }, [dimensionKey, breakdownKey, dimensionDisplayName]);

  if (!dimensionKey) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-full">
        <p className="text-gray-500">Please upload a file and select a column to visualize.</p>
      </div>
    );
  }
  
  const chartTitle = breakdownKey 
    ? `Analysis of '${dimensionDisplayName}' by '${breakdownDisplayName}'` 
    : `Analysis for: ${dimensionDisplayName}`;

  const stackedBarOptions = { maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } };
  const horizontalBarOptions = { indexAxis: 'y' as const, maintainAspectRatio: false };

  // Component nhỏ để render insight với markdown đơn giản
  const InsightText: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split('**');
    return (
      <>
        {parts.map((part, index) => 
          index % 2 === 1 ? <strong key={index} className="text-violet-600">{part}</strong> : part
        )}
      </>
    );
  };

  return (
    <ChartCard title={chartTitle}>
      <div className="h-full flex flex-col justify-center">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!chartData && !error && <p className="text-gray-500 text-center">Loading analysis...</p>}
        {chartData && (
          <Bar 
            data={chartData} 
            options={breakdownKey ? stackedBarOptions : horizontalBarOptions}
          />
        )}
      </div>
      
      {/* Phần hiển thị insight đã được nâng cấp */}
      {insight && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 text-center italic">
            <span className="font-semibold">Key Insight:</span>{' '}
            <InsightText text={insight} />
          </p>
        </div>
      )}
    </ChartCard>
  );
};

export default DynamicChart;