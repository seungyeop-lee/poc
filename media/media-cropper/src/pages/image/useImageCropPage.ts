import { useCallback, useEffect } from 'react';
import { checkImageFormatSupport } from '../../shared/utils/checkFormatSupport.ts';
import { useImageCropStore } from './imageCropStore.ts';
import type { Area } from 'react-easy-crop';
import { cropImage } from '../../shared/utils/cropImage.ts';
import { downloadBlob } from '../../shared/utils/blob.ts';
import { useNavigate } from 'react-router';
import { useMediaStore } from '../../shared/stores/mediaStore.ts';
import { useShallow } from 'zustand/shallow';

export default function useImageCropPage() {
  const navigate = useNavigate();
  const file = useMediaStore((state) => state.file);
  const fileUrl = useMediaStore((state) => state.fileUrl);
  const { croppedAreaPixels, croppedImageUrl, outputWidth, outputHeight, outputFormat } = useImageCropStore(
    useShallow((state) => ({
      croppedAreaPixels: state.croppedAreaPixels,
      croppedImageUrl: state.croppedImageUrl,
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
        console.log(`Format ${format} supported: ${isSupported}`);
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
    downloadBlob(blob, `${file?.name}-${outputWidth}x${outputHeight}.${ext}`);
  };

  return { onCropComplete, handleCrop, handleDownload };
}
