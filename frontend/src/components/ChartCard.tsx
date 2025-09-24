import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode; 
}

// React.FC (Functional Component) là một kiểu generic giúp định nghĩa component và props của nó.
const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center md:text-left">
        {title}
      </h2>
      <div className="relative h-80"> {/* Đặt chiều cao cố định cho container của biểu đồ */}
        {children}
      </div>
    </div>
  );
};

export default ChartCard;