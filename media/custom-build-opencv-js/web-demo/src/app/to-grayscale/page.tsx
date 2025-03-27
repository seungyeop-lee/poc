'use client'

import { cv } from '@/libs/opencv/opencv'
import { useEffect, useRef, useState } from 'react'
import VideoFileSelector from '@/app/to-grayscale/components/VideoFileSelector'
import useVideoSource from '@/hooks/useVideoSource'
import useVideoCap from '@/hooks/useVideoCap'
import { getVideoInfo } from '@/utils/video-utils'

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [startReady, setStartReady] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const streamingRef = useRef(streaming)
  const [videoSource, setVideoSource] = useState<'camera' | 'file'>('camera')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [source, setSource] = useState<MediaStream | File>()
  const { videoRef, start: videoStart, stop: videoStop } = useVideoSource()
  const { init, getMat } = useVideoCap()

  // 비디오 크기 상태 추가 (동적으로 변경될 수 있음)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number, height: number }>()

  useEffect(() => {
    if (videoSource === 'camera') {
      setStartReady(true)
      return
    }

    if (videoSource === 'file' && videoFile) {
      setStartReady(true)
      return
    }

    setStartReady(false)
  }, [videoSource, videoFile])

  useEffect(() => {
    if (!source) {
      return
    }

    videoStart(source, () => {
      setStreaming(true)
      streamingRef.current = true
    })

    return () => {
      if (source instanceof MediaStream) {
        for (const t of source.getTracks()) {
          t.stop()
        }
      }
    }
  }, [source, videoStart])

  useEffect(() => {
    if (!streaming || !videoRef.current) {
      return
    }

    console.log('Starting video processing')
    init(videoRef.current)
    requestAnimationFrame(drawVideoFrame)
  }, [streaming, videoRef.current, init])

  const start = () => {
    if (videoSource === 'camera') {
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        const videoInfo = await getVideoInfo(stream)
        setVideoDimensions(videoInfo)
        setSource(stream)
      })()
    } else if (videoSource === 'file' && videoFile) {
      (async () => {
        const videoInfo = await getVideoInfo(videoFile)
        setVideoDimensions(videoInfo)
        setSource(videoFile)
      })()
    } else {
      console.error('Invalid video source:', videoSource)
    }
  }

  const stop = () => {
    videoStop()
    setStreaming(false)
    streamingRef.current = false

    if (canvasRef.current && videoDimensions) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, videoDimensions.width, videoDimensions.height)
      }
    }

    setSource(undefined)
  }

  const drawVideoFrame = () => {
    if (!streamingRef.current || !videoRef.current || !canvasRef.current) {
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }

    try {
      const mat = getMat()
      const dstMat = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC1)

      // 그레이스케일 변환
      cv.cvtColor(mat, dstMat, cv.COLOR_RGBA2GRAY)
      mat.delete()

      // 결과 표시
      cv.imshow(canvasRef.current, dstMat)
      dstMat.delete()
    } catch (error) {
      console.error('Error processing video frame:', error)
      return
    }

    requestAnimationFrame(drawVideoFrame)
  }

  return (
    <div className="space-y-5 p-5 flex flex-col w-full">
      <h1 className="text-xl">Camera or Video to Grayscale By OpenCV</h1>

      <div className="space-y-5">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              stop()
              setVideoSource('camera')
            }}
            className={`btn ${videoSource === 'camera' ? 'btn-primary' : 'btn-outline'}`}
          >
            카메라 사용
          </button>
          <button
            type="button"
            onClick={() => {
              stop()
              setVideoSource('file')
            }}
            className={`btn ${videoSource === 'file' ? 'btn-primary' : 'btn-outline'}`}
          >
            비디오 파일 사용
          </button>
          {videoSource === 'file' && (
            <VideoFileSelector onSelect={(video) => setVideoFile(video)} />
          )}
        </div>


        <div className="space-x-2">
          <button
            type="button"
            onClick={() => start()}
            className="btn"
            disabled={!startReady || streaming}
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => stop()}
            className="btn"
            disabled={!streaming}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="grow overflow-y-scroll">
        <div>
          <div>Video Feed:</div>
          <video
            key={videoDimensions ? `video-${videoDimensions.width}x${videoDimensions.height}` : 'video-0x0'}
            ref={videoRef}
            width={videoDimensions?.width}
            height={videoDimensions?.height}
            className={`border border-gray-300 ${videoSource === 'camera' ? 'scale-x-[-1]' : ''} w-full`}
          />
        </div>

        <div>
          <div>Processed Output:</div>
          <canvas
            key={videoDimensions ? `output-${videoDimensions.width}x${videoDimensions.height}` : 'output-0x0'}
            ref={canvasRef}
            width={videoDimensions?.width}
            height={videoDimensions?.height}
            className={`border border-gray-300 ${videoSource === 'camera' ? 'scale-x-[-1]' : ''} w-full`}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        비디오 크기: {videoDimensions?.width} x {videoDimensions?.height}
      </div>
    </div>
  )
}
