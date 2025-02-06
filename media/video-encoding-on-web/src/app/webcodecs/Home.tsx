'use client';

import React, {useEffect, useRef, useState} from 'react';

export default function WebcodecsApiHome() {
  const workerRef = useRef<Worker>(null);
  const [source, setSource] = useState<File | null>(null);

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSource(file);
  };

  useEffect(() => {
    workerRef.current = new Worker(new URL('worker.ts', import.meta.url), { type: 'module' });
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  return (
    <div className="w-svh h-svh p-5 flex flex-col justify-center items-center space-y-5">
      <div className="flex justify-center">
        <h1 className="text-2xl">Video Encoding by WebCodecs API</h1>
      </div>
      <input type="file" accept="video/*" onChange={uploadVideo} className="hidden" id="video-upload" />
      <label htmlFor="video-upload" className="btn">
        비디오 업로드
      </label>
      <button
        type="button"
        className="btn"
        onClick={() => {
          if (!source) return;
          workerRef.current?.postMessage({ source });
        }}
      >
        Start Worker
      </button>
    </div>
  );
}
