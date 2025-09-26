import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DynamicChart from './components/DynamicChart';
import type { ApiColumn } from './types';

const App: React.FC = () => {
  const [columns, setColumns] = useState<ApiColumn[]>([]);
  // Đổi tên state cho rõ ràng hơn: Cột chính và Cột phân nhóm
  const [dimensionColumn, setDimensionColumn] = useState<string>('');
  const [breakdownColumn, setBreakdownColumn] = useState<string>(''); // State mới cho cột phân nhóm
  const [errorMessage, setErrorMessage] = useState('');

  const handleUploadSuccess = (availableColumns: ApiColumn[]) => {
    setColumns(availableColumns);
    setErrorMessage('');
    if (availableColumns.length > 0) {
      setDimensionColumn(availableColumns[0].apiKey);
      setBreakdownColumn(''); // Reset cột phân nhóm mỗi khi có file mới
    } else {
      setDimensionColumn('');
      setBreakdownColumn('');
    }
  };

  // Handler cho dropdown cột chính
  const handleDimensionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDimensionColumn(event.target.value);
  };

  // Handler cho dropdown cột phân nhóm
  const handleBreakdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBreakdownColumn(event.target.value);
  };

  // Tìm tên hiển thị cho cả hai cột
  const dimensionDisplayName = columns.find(c => c.apiKey === dimensionColumn)?.displayName || dimensionColumn;
  const breakdownDisplayName = columns.find(c => c.apiKey === breakdownColumn)?.displayName || breakdownColumn;

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Dynamic CSV Data Visualizer
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md-p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <FileUploader onUploadSuccess={handleUploadSuccess} onUploadError={setErrorMessage} />
          
          {errorMessage && <p className="bg-red-100 text-red-700 p-4 rounded-lg">{errorMessage}</p>}

          {columns.length > 0 && (
            <>
              {/* Dropdown 1: Cột chính để phân tích */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Select Column to Analyze</h2>
                <select 
                  value={dimensionColumn} 
                  onChange={handleDimensionChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {columns.map(col => (
                    <option key={col.apiKey} value={col.apiKey}>
                      {col.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: Cột để phân nhóm (tùy chọn) */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Group By (Optional)</h2>
                <select 
                  value={breakdownColumn} 
                  onChange={handleBreakdownChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {/* Lựa chọn mặc định để không phân nhóm */}
                  <option value="">-- No Grouping --</option>
                  {columns.map(col => (
                    // Logic để không cho phép người dùng chọn cùng một cột
                    col.apiKey !== dimensionColumn && (
                      <option key={col.apiKey} value={col.apiKey}>
                        {col.displayName}
                      </option>
                    )
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          {/* Truyền cả hai key và tên hiển thị xuống component con */}
          <DynamicChart 
            dimensionKey={dimensionColumn}
            dimensionDisplayName={dimensionDisplayName}
            breakdownKey={breakdownColumn}
            breakdownDisplayName={breakdownDisplayName}
          />
        </div>
      </main>
    </div>
  );
}

export default App;