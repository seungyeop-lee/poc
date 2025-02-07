'use client';

import React, {useEffect, useRef, useState} from 'react';
import downloadFile from "@/lib/downloadFile";
import {ResultMessageData} from "@/app/webav/worker";
import {Combinator} from "@webav/av-cliper";

export default function WebAVHome() {
  const workerRef = useRef<Worker>(null);
  const [source, setSource] = useState<File | null>(null);
  const [encoded, setEncoded] = useState<Blob | null>(null);
  const [startEncodingTime, setStartEncodingTime] = useState<number | null>();
  const [endEncodingTime, setEndEncodingTime] = useState<number | null>();
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL('worker.ts', import.meta.url), { type: 'module' });

    const handleMessage = (event: MessageEvent<ResultMessageData>) => {
      console.log(`${event.data} >> [Client] Received from Worker!`);
      setEndEncodingTime(Date.now());
      setEncoded(event.data.transcoded || null);
    };
    workerRef.current.addEventListener('message', handleMessage);

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    Combinator.isSupported().then(setIsSupported);
  }, []);

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSource(file);
  };

  const downloadTranscoded = async () => {
    if (!encoded) return;

    downloadFile(encoded, 'output.mp4');
  };

  return (
    <div className="w-svh h-svh p-5 flex flex-col justify-center items-center space-y-5">
      <div className="flex justify-center">
        <h1 className="text-2xl">Video Encoding by WebCodecs API</h1>
      </div>
      <p>{`사용가능여부: ${isSupported ? 'O' : 'X'}`}</p>
      <input type="file" accept="video/*" onChange={uploadVideo} className="hidden" id="video-upload" />
      <label htmlFor="video-upload" className="btn">
        비디오 업로드
      </label>
      <button
        type="button"
        className="btn"
        onClick={async () => {
          if (!source) return;
          setStartEncodingTime(Date.now());
          workerRef.current?.postMessage({ source });
        }}
        disabled={!source}
      >
        Start Worker
      </button>
      <button type="button" className="btn" onClick={downloadTranscoded} disabled={!encoded}>
        비디오 다운로드
      </button>
      <p>{startEncodingTime && endEncodingTime && `소요시간: ${endEncodingTime - startEncodingTime}ms`}</p>
    </div>
  );
}
