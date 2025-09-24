import React from 'react';

// Định nghĩa kiểu dữ liệu cho props của component
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center md:text-left">
        {title}
      </h2>
      <div className="relative h-80">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;