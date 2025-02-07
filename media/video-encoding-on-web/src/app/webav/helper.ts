// crop은 가능하나, 회전된 영상에서 어떻게 작동 할 지 모르겠음
export function createCropVideoFrame(cropWidth: number, cropHeight: number, cropX: number, cropY: number) {
  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('캔버스 컨텍스트를 가져올 수 없습니다.');
  }

  return async (sourceFrame: VideoFrame) => {
    ctx.drawImage(sourceFrame, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const rs = new VideoFrame(canvas, {
      alpha: 'keep',
      timestamp: sourceFrame.timestamp,
      duration: sourceFrame.duration ?? undefined,
    });
    sourceFrame.close();
    return rs;
  };
}

/**
 * VideoFrame 객체를 지정된 영역으로 잘라내 새로운 VideoFrame 객체를 생성합니다.
 *
 * @param {VideoFrame} sourceFrame 원본 VideoFrame 객체
 * @param {number} cropX 잘라낼 영역의 x 좌표 (원본 프레임 기준)
 * @param {number} cropY 잘라낼 영역의 y 좌표 (원본 프레임 기준)
 * @param {number} cropWidth 잘라낼 영역의 너비
 * @param {number} cropHeight 잘라낼 영역의 높이
 * @returns {Promise<VideoFrame>} 잘라낸 VideoFrame 객체
 */
export async function cropVideoFrame(
  sourceFrame: VideoFrame,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
) {
  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('캔버스 컨텍스트를 가져올 수 없습니다.');
  }

  ctx.drawImage(sourceFrame, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  const rs = new VideoFrame(canvas, {
    alpha: 'keep',
    timestamp: sourceFrame.timestamp,
    duration: sourceFrame.duration ?? undefined,
  });
  sourceFrame.close();
  return rs;
}
