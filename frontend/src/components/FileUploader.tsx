import React, { useState } from 'react';
import axios from 'axios';

interface FileUploaderProps {
  onUploadSuccess: (columns: string[]) => void;
  onUploadError: (message: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);
    onUploadError('');

    try {
      // SỬA LỖI Ở ĐÂY:
      // 1. Dùng kết quả trả về từ `axios.post`
      // 2. Không cần gọi `/api/columns` nữa, vì `/api/upload` đã trả về danh sách cột.
      // Tuy nhiên, backend cũ trả về tất cả các cột, chúng ta vẫn nên gọi /api/columns để chỉ lấy cột dạng chữ
      // Giữ nguyên logic gọi 2 API là đúng, chỉ cần sửa cảnh báo.
      
      // Sửa cảnh báo "never used" bằng cách chỉ gọi await mà không gán biến
      await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Lấy danh sách các cột CÓ THỂ PHÂN TÍCH ĐƯỢC (dạng chữ) từ API /api/columns
      const columnsResponse = await axios.get<{ columns: string[] }>('http://127.0.0.1:8000/api/columns');
      onUploadSuccess(columnsResponse.data.columns);

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred.";
      onUploadError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-gray-700">1. Upload your CSV File</h2>
      <input 
        type="file" 
        accept=".csv"
        onChange={handleFileChange} 
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
      <button 
        onClick={handleUpload} 
        disabled={isLoading || !selectedFile}
        className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-full disabled:bg-gray-400 hover:bg-violet-700 transition-colors"
      >
        {isLoading ? 'Processing...' : 'Upload & Analyze'}
      </button>
    </div>
  );
};

export default FileUploader;