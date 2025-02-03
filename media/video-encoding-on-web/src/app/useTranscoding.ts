import {useFFmpeg} from '@/app/useFFmpeg';
import downloadFile from '@/lib/downloadFile';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import React, {useState} from 'react';
import useFrameFlow from "@/app/useFrameFlow";

export default function useTranscoding() {
  const { load, transcoding: ffmpegTranscoding } = useFFmpeg();
  const { transcoding: frameFlowTranscoding } = useFrameFlow();
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [source, setSource] = useState<File | null>(null);
  const [transcoded, setTranscoded] = useState<Uint8Array | null>(null);

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSource(file);
  };

  const loadFFmpeg = async (callback?: (ffmpeg: FFmpeg) => void) => {
    await load((ffmpeg) => {
      setFfmpegLoaded(true);
      if (callback) {
        callback(ffmpeg);
      }
    });
  };

  const transcodingByFFmpeg = async (preset: string) => {
    if (!source) return;
    const transcoded = await ffmpegTranscoding({ file: source, preset: preset });
    setTranscoded(transcoded as Uint8Array);
  };

  const transcodingByFrameflow = async () => {
    if (!source) return;
    const transcoded = await frameFlowTranscoding(source);
    if (transcoded) setTranscoded(transcoded);
  };

  const downloadTranscoded = async () => {
    if (!transcoded) return;

    const blob = new Blob([transcoded.buffer as ArrayBuffer], { type: 'video/mp4' });
    downloadFile(blob, 'output.mp4');
  };

  return {
    source: {
      file: source,
      upload: uploadVideo,
    },
    frameflow: {
      transcoding: transcodingByFrameflow,
    },
    ffmpeg: {
      load: loadFFmpeg,
      loaded: ffmpegLoaded,
      transcoding: transcodingByFFmpeg,
    },
    transcoded: {
      data: transcoded,
      download: downloadTranscoded,
    },
  };
}
