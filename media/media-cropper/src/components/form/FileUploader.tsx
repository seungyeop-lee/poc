import React, { useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="cursor-pointer">
        <div className="text-gray-600">
          <p className="text-lg font-medium mb-2">파일을 여기에 드래그하거나 클릭하여 선택하세요</p>
          <p className="text-sm text-gray-500">이미지 또는 비디오 파일을 지원합니다</p>
        </div>
      </label>
    </div>
  );
}

export default FileUploader;
