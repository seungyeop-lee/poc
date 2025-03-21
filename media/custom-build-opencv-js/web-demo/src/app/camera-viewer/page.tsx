'use client'

import { useEffect, useState } from 'react'
import useVideoSource from '@/app/to-grayscale/hooks/useVideoSource'
import { getVideoInfo } from '@/utils/video-utils'

export default function Page() {
  const [streaming, setStreaming] = useState(false)
  const [source, setSource] = useState<MediaStream>()
  const { videoRef, start: videoStart, stop: videoStop } = useVideoSource()

  // 비디오 크기 상태 추가 (동적으로 변경될 수 있음)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number, height: number }>()

  useEffect(() => {
    if (!source) {
      setStreaming(false)
      videoStop()
      return
    }

    videoStart(source, () => {
      setStreaming(true)
    })

    return () => {
      for (const t of source?.getTracks() || []) {
        t.stop()
      }
    }
  }, [source, videoStart, videoStop])

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    const videoInfo = await getVideoInfo(stream)
    setVideoDimensions(videoInfo)
    setSource(stream)
  }

  const stop = () => {
    setSource(undefined)
    setVideoDimensions(undefined)
  }

  return (
    <div className="space-y-5 p-5 flex flex-col w-full">
      <h1 className="text-xl">Camera Viewer</h1>

      <div className="space-y-5">
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => start()}
            className="btn"
            disabled={streaming}
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
            className="border border-gray-300 scale-x-[-1] w-full"
          />
        </div>
      </div>

      {videoDimensions &&
        <div className="text-xs text-gray-500">
          비디오 크기: {videoDimensions?.width} x {videoDimensions?.height}
        </div>
      }
    </div>
  )
}
