interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropImageOptions {
  imageSrc: string;
  croppedAreaPixels: CroppedAreaPixels;
  outputWidth?: number;
  outputHeight?: number;
  outputFormat?: string;
}

export async function cropImage(options: CropImageOptions): Promise<Blob> {
  const { imageSrc, croppedAreaPixels, outputWidth, outputHeight, outputFormat = 'image/png' } = options;
  // 1. 원본 이미지를 메모리에 로드
  const image = await loadImage(imageSrc);

  // 2. 크롭된 이미지를 그릴 캔버스 생성
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // 3. 출력 설정 결정 (지정되지 않으면 크롭 영역 크기 사용)
  const finalWidth = outputWidth ?? croppedAreaPixels.width;
  const finalHeight = outputHeight ?? croppedAreaPixels.height;
  const finalFormat = outputFormat;

  // 4. 캔버스 크기를 최종 출력 크기로 설정
  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // 5. drawImage로 크롭 및 리사이징 수행
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  // - 소스(원본): (sx, sy)부터 (sWidth x sHeight) 영역을 잘라냄
  // - 대상(캔버스): (dx, dy)부터 (dWidth x dHeight) 크기로 그림
  // 결과: 원본의 특정 영역을 잘라서 지정된 크기로 캔버스에 그림 (크롭 + 리사이징)
  ctx.drawImage(
    image,
    croppedAreaPixels.x, // 원본에서 자를 시작 x 좌표
    croppedAreaPixels.y, // 원본에서 자를 시작 y 좌표
    croppedAreaPixels.width, // 원본에서 자를 너비
    croppedAreaPixels.height, // 원본에서 자를 높이
    0, // 캔버스에 그릴 시작 x (왼쪽 상단부터)
    0, // 캔버스에 그릴 시작 y
    finalWidth, // 캔버스에 그릴 너비 (리사이징)
    finalHeight, // 캔버스에 그릴 높이 (리사이징)
  );

  // 6. 캔버스의 픽셀 데이터를 이미지 파일 형식(Blob)으로 인코딩
  // toBlob은 Canvas 내용을 JPEG, PNG 등의 이미지 파일로 변환
  // - finalFormat: 출력 이미지 형식 (image/jpeg, image/png 등)
  // - 0.95: 품질 (JPEG/WebP의 경우 0.0~1.0, PNG는 무시됨)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      finalFormat,
      0.95, // JPEG 품질 95% (높은 품질)
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
