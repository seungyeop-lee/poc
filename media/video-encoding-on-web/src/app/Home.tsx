'use client';

import useLog from '@/app/useLog';
import useTranscoding from '@/app/useTranscoding';
import React, {useEffect, useState} from 'react';

export default function Home() {
  const { source, frameflow, ffmpeg, transcoded } = useTranscoding();
  const { logDivRef, messageRef, log } = useLog();
  const [preset, setPreset] = useState('ultrafast');

  useEffect(() => {
    if (!source.file) return;
    log(`파일 선택: ${source.file.name}`);
  }, [source.file, log]);

  return (
    <div className="w-svh h-svh p-5 flex flex-col justify-center items-center space-y-5">
      <div className="flex justify-center">
        <h1 className="text-2xl">Video Encoding on Web Demo</h1>
      </div>
      <div className="grow flex flex-col w-[100%] md:w-[80%] xl:w-[60%] space-y-3 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex justify-center">
            <input type="file" accept="video/*" onChange={source.upload} className="hidden" id="video-upload" />
            <label htmlFor="video-upload" className="btn w-36 mr-5">
              비디오 업로드
            </label>
            <button type="button" className="btn w-36" disabled={!transcoded.data} onClick={transcoded.download}>
              비디오 다운로드
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="btn w-36 mr-5"
              disabled={!source.file}
              onClick={async () => {
                log('frameflow 인코딩 시작');
                const startTranscodingTime = Date.now();
                await frameflow.transcoding();
                const endTranscodingTime = Date.now();
                log(`frameflow 인코딩 완료 - 소요시간: ${endTranscodingTime - startTranscodingTime}ms`);
              }}
            >
              frameflow
            </button>
            <p className="w-36 invisible">temp</p>
          </div>
          <div className="flex justify-center items-end">
            <button
              type="button"
              className="btn w-36 mr-5"
              disabled={!source.file}
              onClick={async () => {
                log('FFmpeg 로드 시작');
                const startLoadTime = Date.now();
                await ffmpeg.load((f) => {
                  f.on('log', ({ message }) => log(message));
                });
                const endLoadTime = Date.now();
                log(`FFmpeg 로드 완료 - 소요시간: ${endLoadTime - startLoadTime}ms`);
                log(`인코딩 시작 - file: ${source.file?.name}, preset: ${preset}`);
                const startTranscodingTime = Date.now();
                await ffmpeg.transcoding(preset);
                const endTranscodingTime = Date.now();
                log(`인코딩 완료 - 소요시간: ${endTranscodingTime - startTranscodingTime}ms`);
              }}
            >
              FFmpeg 인코딩
            </button>
            <label className="form-control w-36">
              <div className="label">
                <span className="label-text">preset</span>
              </div>
              <select
                className="select select-bordered"
                defaultValue={preset}
                onChange={(e) => setPreset(e.target.value)}
              >
                <option>ultrafast</option>
                <option>veryfast</option>
                <option>medium</option>
              </select>
            </label>
          </div>
        </div>
        <div ref={logDivRef} className="grow overflow-y-auto border-2">
          <span ref={messageRef} />
        </div>
      </div>
    </div>
  );
}
