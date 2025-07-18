'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

/**
 * 이미지 파일 업로드를 위한 컴포넌트
 * 오버레이용 이미지 선택 기능 제공
 */
interface ImageUploadProps {
  /** 이미지 파일이 선택되었을 때 호출되는 콜백 */
  onImageSelect: (file: File) => void;
  /** 최대 파일 크기 (바이트) */
  maxFileSize?: number;
  /** 지원하는 이미지 포맷 */
  acceptedFormats?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect,
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
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
      onImageSelect(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">오버레이 이미지 선택</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-lg font-medium mb-2">오버레이할 이미지를 선택하세요</p>
          <p className="text-gray-500">PNG, JPG, GIF 파일 지원 (투명 배경 권장)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image
                src={previewUrl || ''}
                alt="오버레이 이미지 미리보기"
                width={128}
                height={128}
                className="w-32 h-32 object-contain bg-gray-100 rounded-lg border"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                파일명: {selectedFile.name}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                크기: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-green-600 mb-3">
                ✓ 이미지가 영상 우측상단에 오버레이됩니다
              </p>
              <button
                onClick={removeImage}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                이미지 제거
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;