import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="w-svh h-svh p-5 flex flex-col justify-center items-center space-y-5">
      <div className="flex justify-center">
        <h1 className="text-2xl">Video Encoding on Browser Demo</h1>
      </div>
      <div className="grow flex flex-col w-[100%] md:w-[80%] xl:w-[60%] space-y-3 overflow-y-auto">
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <Link href={'/ffmpeg'}>FFmpeg</Link>
          </li>
          <li>
            <Link href={'/webav'}>WebAV</Link>
          </li>
          <li>
            <Link href={'/webcodecs'}>WebCodecs</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
