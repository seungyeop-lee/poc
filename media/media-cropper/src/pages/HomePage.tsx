import { useNavigate } from 'react-router';
import { FileUploader, PageLayout } from '../components/index.ts';
import { useMediaStore } from '../stores/mediaStore.ts';

export default function HomePage() {
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    useMediaStore.getState().setMedia(file);

    if (file.type.startsWith('image/')) {
      navigate('/image-crop');
      return;
    }

    if (file.type.startsWith('video/')) {
      // Safari 브라우저 체크
      if (isSafari()) {
        useMediaStore.getState().clearMedia();
        alert(
          'Safari 브라우저에서는 비디오 편집을 지원하지 않습니다. Chrome, Firefox 또는 Edge 브라우저를 사용해주세요.',
        );
      } else {
        navigate('/video-crop');
      }
      return;
    }

    useMediaStore.getState().clearMedia();
    alert('이미지 또는 비디오 파일만 업로드할 수 있습니다.');
  };

  return (
    <PageLayout containerWidth="narrow" centered>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Media Cropper</h1>
        <p className="text-gray-600">브라우저에서 이미지와 비디오를 크롭하세요</p>
      </div>
      <FileUploader onFileSelect={handleFileSelect} />
    </PageLayout>
  );
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
