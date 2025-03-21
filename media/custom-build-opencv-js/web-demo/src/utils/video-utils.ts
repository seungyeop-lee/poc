export type VideoInfo = {
  width: number;
  height: number;
};

export async function getVideoInfo(src: string | Blob | MediaStream) {
  const videoEle = document.createElement('video')
  if (src instanceof MediaStream) {
    videoEle.srcObject = src
  } else {
    const url = typeof src === 'string' ? src : URL.createObjectURL(src)
    videoEle.src = url
  }

  return await new Promise<VideoInfo>((resolve, reject) => {
    videoEle.onloadedmetadata = (e) => {
      const ele = e.currentTarget as HTMLVideoElement
      resolve({ width: ele.videoWidth, height: ele.videoHeight })
    }
  })
}
