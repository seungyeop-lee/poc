import Cropper from 'react-easy-crop';
import { useShallow } from 'zustand/shallow';
import { useMediaStore } from '../../shared/stores/mediaStore.ts';
import { useImageCropStore } from './imageCropStore.ts';
import useImageCropPage from './useImageCropPage.ts';
import PageLayout from '../../shared/components/presentational/layout/PageLayout.tsx';
import PageHeader from '../../shared/components/presentational/layout/PageHeader.tsx';
import CropResizePanel from '../../shared/components/presentational/form/CropResizePanel.tsx';
import ImageOutputSettingsPanel from '../../shared/components/presentational/form/ImageOutputSettingsPanel.tsx';
import LoadingSpinner from '../../shared/components/presentational/ui/LoadingSpinner.tsx';
import MediaPreview from '../../shared/components/presentational/media/MediaPreview.tsx';

export default function ImageEditPage() {
  const fileUrl = useMediaStore((state) => state.fileUrl);
  const {
    crop,
    zoom,
    aspect,
    croppedAreaPixels,
    croppedImageUrl,
    isProcessing,
    scale,
    outputFormat,
    supportedFormats,
  } = useImageCropStore(
    useShallow((state) => ({
      crop: state.crop,
      zoom: state.zoom,
      aspect: state.aspect,
      croppedAreaPixels: state.croppedAreaPixels,
      croppedImageUrl: state.croppedImageUrl,
      isProcessing: state.isProcessing,
      scale: state.scale,
      outputFormat: state.outputFormat,
      supportedFormats: state.supportedFormats,
    })),
  );
  const { onCropComplete, handleCrop, handleDownload } = useImageCropPage();

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

          <ImageOutputSettingsPanel
            outputFormat={outputFormat}
            supportedFormats={supportedFormats}
            onFormatChange={(format) => {
              useImageCropStore.setState({ outputFormat: format });
            }}
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
