'use client'

import { useEffect, useState } from 'react'
import { cv } from '@/libs/opencv/opencv'

export default function OpenCVLoadTestPage() {
  const [loadSift, setLoadSift] = useState<boolean>()
  const [buildInfo, setBuildInfo] = useState<string>()

  useEffect(() => {
    setBuildInfo(cv.getBuildInformation())

    const sift = new cv.SIFT(1000)
    setLoadSift(!!sift)
  }, [])

  return (
    <div className="space-y-3 flex flex-col p-5">
      <h1 className="text-xl">OpenCV Load Test</h1>
      <div className="text-red-600">
        {
          loadSift
            ? 'SIFT loaded successfully'
            : 'SIFT load failed'
        }
      </div>
      <div className="grow overflow-y-scroll">
        <div className="whitespace-pre-wrap">{buildInfo}</div>
      </div>
    </div>
  )
}
