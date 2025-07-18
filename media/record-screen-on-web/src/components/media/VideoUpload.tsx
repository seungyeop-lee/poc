'use client';

import { useRef, useState } from 'react';

/**
 * 비디오 파일 업로드를 위한 컴포넌트
 * 드래그 앤 드롭 및 파일 선택 기능 지원
 */
interface VideoUploadProps {
  /** 비디오 파일이 선택되었을 때 호출되는 콜백 */
  onVideoSelect: (file: File) => void;
  /** 뒤로 가기 버튼 클릭 시 호출되는 콜백 */
  onBack: () => void;
  /** 최대 파일 크기 (바이트) */
  maxFileSize?: number;
  /** 지원하는 비디오 포맷 */
  acceptedFormats?: string[];
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onVideoSelect, 
  onBack,
  maxFileSize = 100 * 1024 * 1024 // 100MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (!file.type.startsWith('video/')) {
      setError('비디오 파일만 업로드할 수 있습니다.');
      return false;
    }
    
    if (file.size > maxFileSize) {
      setError(`파일 크기는 ${(maxFileSize / 1024 / 1024).toFixed(0)}MB 이하여야 합니다.`);
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onVideoSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">비디오 파일 업로드</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          ← 뒤로
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-lg font-medium mb-2">비디오 파일을 드래그하거나 클릭하여 선택</p>
          <p className="text-gray-500">MP4, WebM, MOV 파일 지원</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <video
              src={previewUrl || undefined}
              controls
              className="w-full max-h-64 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              파일명: {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              크기: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              이 비디오 사용
            </button>
            <button
              onClick={resetSelection}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              다시 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;