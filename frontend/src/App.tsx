import React from 'react';
import AgeDistributionChart from './components/AgeDistributionChart';
import PlatformPopularityChart from './components/PlatformPopularityChart';
import OccupationChart from './components/OccupationChart';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Dashboard Phân tích Hành vi Người dùng Mạng xã hội
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AgeDistributionChart />
          <PlatformPopularityChart />
          <OccupationChart />
        </div>
      </main>
    </div>
  );
}

export default App;