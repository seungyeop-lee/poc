import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Cropper, { type Area } from 'react-easy-crop';
import { useShallow } from 'zustand/shallow';
import { CropResizePanel, LoadingSpinner, MediaPreview, PageHeader, PageLayout } from '../components/index.ts';
import { cropImage } from '../utils/cropImage.ts';
import { checkImageFormatSupport } from '../utils/checkFormatSupport.ts';
import { useMediaStore } from '../stores/mediaStore.ts';
import { useImageCropStore } from '../stores/imageCropStore.ts';
import { downloadBlob } from '../utils/blob.ts';

export default function ImageCropPage() {
  const navigate = useNavigate();
  const fileUrl = useMediaStore((state) => state.fileUrl);
  const {
    crop,
    zoom,
    aspect,
    croppedAreaPixels,
    croppedImageUrl,
    isProcessing,
    scale,
    outputWidth,
    outputHeight,
    outputFormat,
  } = useImageCropStore(
    useShallow((state) => ({
      crop: state.crop,
      zoom: state.zoom,
      aspect: state.aspect,
      croppedAreaPixels: state.croppedAreaPixels,
      croppedImageUrl: state.croppedImageUrl,
      isProcessing: state.isProcessing,
      scale: state.scale,
      outputWidth: state.outputWidth,
      outputHeight: state.outputHeight,
      outputFormat: state.outputFormat,
    })),
  );

  useEffect(() => {
    if (!fileUrl) {
      navigate('/');
    }
  }, [fileUrl, navigate]);

  useEffect(() => {
    (async function checkFormats() {
      const formats = ['image/jpeg', 'image/png', 'image/webp'];
      const supported = [];
      for (const format of formats) {
        const isSupported = await checkImageFormatSupport(format);
        if (isSupported) {
          supported.push(format);
        }
      }
      useImageCropStore.setState({ supportedFormats: supported });
    })();

    return () => {
      useImageCropStore.getState().cleanUp();
    };
  }, []);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    useImageCropStore.getState().changeCropArea(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!fileUrl || !croppedAreaPixels) {
      return;
    }
    useImageCropStore.setState({ isProcessing: true });
    try {
      const blob = await cropImage({
        imageSrc: fileUrl,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
        outputFormat,
      });
      const url = URL.createObjectURL(blob);
      useImageCropStore.setState({ croppedImageUrl: url });
    } catch (error) {
      console.error('Crop failed:', error);
      alert('크롭 처리 중 오류가 발생했습니다.');
    } finally {
      useImageCropStore.setState({ isProcessing: false });
    }
  };

  const handleDownload = async () => {
    if (!croppedImageUrl) {
      return;
    }

    const res = await fetch(croppedImageUrl);
    if (!res.ok) {
      alert('다운로드를 위한 파일을 불러오는 중 오류가 발생했습니다.');
      return;
    }

    const blob = await res.blob();
    const ext = outputFormat.split('/')[1];
    downloadBlob(blob, `cropped-${Date.now()}.${ext}`);
  };

  return (
    <PageLayout>
      <PageHeader title="이미지 크롭" />

      <div className="grid grid-cols-1 gap-y-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden relative h-[500px]">
            <Cropper
              image={fileUrl || ''}
              crop={crop}
              zoom={zoom}
              aspect={aspect || undefined}
              onCropChange={(location) => {
                useImageCropStore.setState({ crop: location });
              }}
              onZoomChange={(zoom) => {
                useImageCropStore.setState({ zoom: zoom });
              }}
              onCropComplete={onCropComplete}
              restrictPosition={true}
            />
          </div>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <CropResizePanel
            zoom={zoom}
            onZoomChange={(zoom) => {
              useImageCropStore.setState({ zoom: zoom });
            }}
            aspect={aspect}
            onAspectChange={(aspect) => {
              useImageCropStore.setState({ aspect: aspect });
            }}
            scale={scale}
            onScaleChange={(scale) => {
              useImageCropStore.getState().changeScale(scale);
            }}
            cropAreaWidth={croppedAreaPixels?.width || 0}
            cropAreaHeight={croppedAreaPixels?.height || 0}
          />

          <button
            onClick={handleCrop}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isProcessing ? <LoadingSpinner size="small" message="처리 중..." /> : '크롭 실행'}
          </button>

          {croppedImageUrl && (
            <MediaPreview mediaType="image" src={croppedImageUrl} onDownload={handleDownload} className={'w-full'} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
