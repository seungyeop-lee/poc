import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Cropper from 'react-easy-crop';
import {
  PageLayout,
  PageHeader,
  ErrorState,
  LoadingSpinner,
  MediaPreview,
  CropControls,
  ResizeScaleSlider,
  FormatSelector
} from '../components/index.ts';
import { cropImage, downloadBlob } from '../utils/cropImage.ts';
import { checkImageFormatSupport } from '../utils/checkFormatSupport.ts';
import { useMediaStore } from '../stores/mediaStore.ts';
import { useImageCropStore } from '../stores/imageCropStore.ts';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function ImageCropPage() {
  const navigate = useNavigate();
  const file = useMediaStore((state) => state.file);
  const fileUrl = useMediaStore((state) => state.fileUrl);

  const crop = useImageCropStore((state) => state.crop);
  const zoom = useImageCropStore((state) => state.zoom);
  const aspect = useImageCropStore((state) => state.aspect);
  const croppedAreaPixels = useImageCropStore((state) => state.croppedAreaPixels);
  const croppedImageUrl = useImageCropStore((state) => state.croppedImageUrl);
  const isProcessing = useImageCropStore((state) => state.isProcessing);
  const scale = useImageCropStore((state) => state.scale);
  const outputWidth = useImageCropStore((state) => state.outputWidth);
  const outputHeight = useImageCropStore((state) => state.outputHeight);
  const outputFormat = useImageCropStore((state) => state.outputFormat);
  const supportedFormats = useImageCropStore((state) => state.supportedFormats);

  const setCrop = useImageCropStore((state) => state.setCrop);
  const setZoom = useImageCropStore((state) => state.setZoom);
  const setAspect = useImageCropStore((state) => state.setAspect);
  const setCroppedAreaPixels = useImageCropStore((state) => state.setCroppedAreaPixels);
  const setCroppedImageUrl = useImageCropStore((state) => state.setCroppedImageUrl);
  const setIsProcessing = useImageCropStore((state) => state.setIsProcessing);
  const setScale = useImageCropStore((state) => state.setScale);
  const setOutputWidth = useImageCropStore((state) => state.setOutputWidth);
  const setOutputHeight = useImageCropStore((state) => state.setOutputHeight);
  const setOutputFormat = useImageCropStore((state) => state.setOutputFormat);
  const setSupportedFormats = useImageCropStore((state) => state.setSupportedFormats);
  const cleanup = useImageCropStore((state) => state.cleanup);

  useEffect(() => {
    async function checkFormats() {
      const formats = ['image/jpeg', 'image/png', 'image/webp'];
      const supported = [];
      for (const format of formats) {
        const isSupported = await checkImageFormatSupport(format);
        if (isSupported) {
          supported.push(format);
        }
      }
      setSupportedFormats(supported);
    }
    checkFormats();
  }, [setSupportedFormats]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (croppedAreaPixels) {
      setOutputWidth(Math.round(croppedAreaPixels.width * scale));
      setOutputHeight(Math.round(croppedAreaPixels.height * scale));
    }
  }, [scale, croppedAreaPixels]);

  const handleCrop = async () => {
    if (!fileUrl || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const blob = await cropImage(
        fileUrl,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
        outputFormat
      );
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
          const ext = outputFormat.split('/')[1];
          downloadBlob(blob, `cropped-${Date.now()}.${ext}`);
        });
    }
  };

  if (!file || !fileUrl) {
    return (
      <PageLayout>
        <ErrorState
          message="파일이 선택되지 않았습니다."
          action={{
            label: "홈으로 돌아가기",
            onClick: () => navigate('/')
          }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader title="이미지 크롭" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px', position: 'relative' }}>
            <Cropper
              image={fileUrl}
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

          {croppedAreaPixels && (
            <ResizeScaleSlider
              scale={scale}
              onScaleChange={setScale}
              cropAreaWidth={croppedAreaPixels.width}
              cropAreaHeight={croppedAreaPixels.height}
            />
          )}

          <FormatSelector
            mediaType="image"
            selectedFormat={outputFormat}
            onFormatChange={setOutputFormat}
            supportedFormats={supportedFormats}
          />

          <button
            onClick={handleCrop}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isProcessing ? (
                <LoadingSpinner size="small" message="처리 중..." />
              ) : (
                '크롭 실행'
              )}
          </button>

          {croppedImageUrl && (
            <MediaPreview
              mediaType="image"
              src={croppedImageUrl}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default ImageCropPage;
