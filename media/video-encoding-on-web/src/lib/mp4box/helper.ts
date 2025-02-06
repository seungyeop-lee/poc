import {createFile, MP4ArrayBuffer, MP4File} from 'mp4box'; // transformation matrix를 사용하여 회전 각도를 계산하는 함수

// transformation matrix를 사용하여 회전 각도를 계산하는 함수
// mp4box.js에서 trak.tkhd.matrix 로 값 획득
export function calculateRotation(matrix?: Int32Array) {
  if (!matrix) {
    return 0;
  }

  const a = matrix[0];
  const b = matrix[1];

  const rotationRadians = Math.atan2(b, a);
  let rotationDegrees = Math.round(rotationRadians * (180 / Math.PI));

  // 각도를 0-360 범위로 정규화
  rotationDegrees = (rotationDegrees + 360) % 360;
  return rotationDegrees;
}

export function getRotationByMp4BoxBinData(data: MP4ArrayBuffer) {
  const boxfile = createFile();
  data.fileStart = 0;
  boxfile.appendBuffer(data);

  console.log(boxfile.moov);
  const tkhd = getVideoTrackTkhd(boxfile);
  if (!tkhd) {
    console.warn('영상의 tkhd를 찾을 수 없습니다.');
    return 0;
  }

  return calculateRotation(tkhd.matrix);
}

function getVideoTrackTkhd(file: MP4File) {
  if (!file.moov) {
    return;
  }

  for (const trak of file.moov.traks) {
    const tkhd = trak.tkhd;
    if (!tkhd) {
      continue;
    }
    if (tkhd.width && tkhd.height && tkhd.duration) {
      return tkhd;
    }
  }

  return;
}
