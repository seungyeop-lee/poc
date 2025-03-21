import { useRef } from 'react'
import { cv } from '@/libs/opencv/opencv'
import { VideoCapture } from '@/libs/opencv/types/_hacks'

export default function useVideoCap() {
  const capRef = useRef<VideoCapture>(null)

  const init = (video: HTMLVideoElement) => {
    capRef.current = new cv.VideoCapture(video)
  }

  const getMat = () => {
    if (!capRef.current) {
      return new cv.Mat()
    }

    const mat = new cv.Mat(capRef.current.video.height, capRef.current.video.width, cv.CV_8UC4)
    capRef.current.read(mat)
    return mat
  }

  return {
    init,
    getMat
  }
}
