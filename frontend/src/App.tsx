import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DynamicChart from './components/DynamicChart';
import type { ApiColumn } from './types'; // Import kiểu mới

const App: React.FC = () => {
  const [columns, setColumns] = useState<ApiColumn[]>([]);
  const [selectedColumnKey, setSelectedColumnKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUploadSuccess = (availableColumns: ApiColumn[]) => {
    setColumns(availableColumns);
    setErrorMessage('');
    if (availableColumns.length > 0) {
      setSelectedColumnKey(availableColumns[0].apiKey); // Chọn apiKey của cột đầu tiên
    }
  };

  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColumnKey(event.target.value);
  };

  // Tìm displayName tương ứng để hiển thị trên biểu đồ
  const selectedColumnDisplayName = columns.find(c => c.apiKey === selectedColumnKey)?.displayName || selectedColumnKey;

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Dynamic CSV Data Visualizer
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <FileUploader onUploadSuccess={handleUploadSuccess} onUploadError={setErrorMessage} />
          
          {errorMessage && <p className="bg-red-100 text-red-700 p-4 rounded-lg">{errorMessage}</p>}

          {columns.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Select a Column to Analyze</h2>
              <select 
                value={selectedColumnKey} 
                onChange={handleColumnChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {/* Hiển thị displayName, nhưng value là apiKey */}
                {columns.map(col => (
                  <option key={col.apiKey} value={col.apiKey}>
                    {col.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {/* Truyền cả hai key và displayName xuống component con */}
          <DynamicChart 
            columnKey={selectedColumnKey} 
            columnDisplayName={selectedColumnDisplayName} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;