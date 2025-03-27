import { useCallback, useRef } from 'react'

export default function useVideoSource() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const start = useCallback((
    source: MediaStream | Blob,
    onReady: () => void = () => {
    }
  ) => {
    cleanup()

    if (!videoRef.current) {
      return
    }

    if (source instanceof MediaStream) {
      videoRef.current.srcObject = source
    } else if (source instanceof Blob) {
      videoRef.current.srcObject = null
      videoRef.current.src = URL.createObjectURL(source)
    }

    videoRef.current.onloadedmetadata = (ev) => {
      if (!ev.currentTarget) {
        return
      }

      // const video = ev.currentTarget as HTMLVideoElement
      // video.width = video.videoWidth
      // video.height = video.videoHeight
      console.log('Video metadata loaded')
    }

    videoRef.current.oncanplay = (ev) => {
      if (!ev.currentTarget) {
        return
      }

      const video = ev.currentTarget as HTMLVideoElement
      console.log('Video can play')
      onReady()
      video.play()
    }

    videoRef.current.load()
  }, [])

  const stop = useCallback(() => {
    cleanup()
  }, [])

  const cleanup = () => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.pause()
    videoRef.current.srcObject = null
    if (videoRef.current.src) {
      URL.revokeObjectURL(videoRef.current.src)
      videoRef.current.src = ''
    }
  }

  return {
    videoRef,
    start,
    stop
  }
}
