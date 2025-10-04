import { useNavigate } from 'react-router';
import FileUploader from '../components/FileUploader.tsx';

function HomePage() {
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    const fileUrl = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      navigate('/image-crop', { state: { file, fileUrl } });
    } else if (file.type.startsWith('video/')) {
      navigate('/video-crop', { state: { file, fileUrl } });
    } else {
      alert('이미지 또는 비디오 파일만 업로드할 수 있습니다.');
      URL.revokeObjectURL(fileUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Media Cropper</h1>
          <p className="text-gray-600">
            브라우저에서 이미지와 비디오를 크롭하세요
          </p>
        </div>
        <FileUploader onFileSelect={handleFileSelect} />
      </div>
    </div>
  );
}

export default HomePage;
