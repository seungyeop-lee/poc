import {FFmpeg} from '@ffmpeg/ffmpeg';
import {toBlobURL} from '@ffmpeg/util';
import {useRef} from 'react';

export type TranscodingParams = {
  file: File;
  preset?: string;
};

export function useFFmpeg() {
  const ffmpegRef = useRef(new FFmpeg());

  const load = async (callback?: (ffmpeg: FFmpeg) => void) => {
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) {
      return;
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.9/dist/umd';
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });

    if (callback) {
      callback(ffmpeg);
    }
  };

  const transcoding = async ({ file, preset = 'ultrafast' }: TranscodingParams) => {
    const ffmpeg = ffmpegRef.current;

    await ffmpeg.writeFile(file.name, new Uint8Array(await file.arrayBuffer()));
    await ffmpeg.exec([
      '-y',
      '-hide_banner',
      '-i',
      file.name,
      '-vf',
      // `crop=456:720:11:0,scale='if(gt(iw,ih),1280,-1)':'if(gt(iw,ih),-1,1280)',pad=ceil(iw/2)*2:ceil(ih/2)*2`,
      `scale='if(gt(iw,ih),1280,-1)':'if(gt(iw,ih),-1,1280)',pad=ceil(iw/2)*2:ceil(ih/2)*2`,
      '-c:v',
      'libx264',
      '-preset',
      preset,
      '-threads',
      '4',
      'output.mp4',
    ]);
    return await ffmpeg.readFile('output.mp4');
  };

  return {
    load,
    transcoding,
  };
}
