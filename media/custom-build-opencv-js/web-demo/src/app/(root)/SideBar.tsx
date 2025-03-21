import React from 'react'
import Link from 'next/link'

export default function SideBar() {
  return (
    <div className="min-w-50 h-full bg-base-200">
      <div>
        <h1 className="text-xl text-center p-4">
          <Link href="/">OpenCV.js Demo</Link>
        </h1>
      </div>
      <ul className="menu text-base-content w-full p-4">
        <li><Link href="/camera-viewer">Camera Viewer</Link></li>
        <li><Link href="/opencv-load-test">OpenCV Load Test</Link></li>
        <li><Link href="/to-grayscale">To Grayscale</Link></li>
      </ul>
    </div>
  )
}
