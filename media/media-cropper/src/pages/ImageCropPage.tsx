import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Cropper from 'react-easy-crop';
import CropControls from '../components/CropControls.tsx';
import { cropImage, downloadBlob } from '../utils/cropImage.ts';

interface LocationState {
  file: File;
  fileUrl: string;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function ImageCropPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!state?.fileUrl || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const blob = await cropImage(state.fileUrl, croppedAreaPixels);
      const url = URL.createObjectURL(blob);
      setCroppedImageUrl(url);
    } catch (error) {
      console.error('Crop failed:', error);
      alert('크롭 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (croppedImageUrl) {
      fetch(croppedImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          downloadBlob(blob, `cropped-${Date.now()}.jpg`);
        });
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">파일이 선택되지 않았습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">이미지 크롭</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            홈으로
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px', position: 'relative' }}>
              <Cropper
                image={state.fileUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect || undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <CropControls
              zoom={zoom}
              onZoomChange={setZoom}
              aspect={aspect}
              onAspectChange={setAspect}
            />

            <button
              onClick={handleCrop}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? '처리 중...' : '크롭 실행'}
            </button>

            {croppedImageUrl && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">미리보기</h3>
                <img src={croppedImageUrl} alt="Cropped" className="w-full rounded" />
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  다운로드
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropPage;
