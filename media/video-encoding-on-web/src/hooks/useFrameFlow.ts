import fflow, {Track, TrackGroup} from 'frameflow';
import {VideoStreamMetadata} from 'frameflow/dist/types/graph';

export default function useFrameFlow() {
  const transcoding = async (source: File) => {
    if (!source) return;
    const video = await fflow.source(source as Blob);

    const videoTrack = video.filter('video').tracks()[0];
    const { width, height, frameRate } = videoTrack.metadata as VideoStreamMetadata;
    console.log(`width: ${width}, height: ${height}, frameRate: ${frameRate}`);
    const decodeStream = await videoTrack.export({
      format: 'rawvideo',
      worker: fflow.load({ newWorker: true }),
    });

    // Set target dimensions
    const targetWidth = width > height ? 1280 : Math.ceil((width / height) * 1280);
    const adjustedWidth = targetWidth % 2 === 0 ? targetWidth : targetWidth + 1;

    const targetHeight = width > height ? Math.ceil((height / width) * 1280) : 1280;
    const adjustedHeight = targetHeight % 2 === 0 ? targetHeight : targetHeight + 1;

    // OffscreenCanvas with target dimensions
    const canvas = new OffscreenCanvas(adjustedWidth, adjustedHeight);
    const ctx = canvas.getContext('2d');

    const nextFrame = async () => {
      const chunk = await decodeStream.next();
      if (!chunk || !ctx || !chunk.videoFrame) return;
      // Scale the video frame to target dimensions
      ctx.drawImage(chunk.videoFrame, 0, 0, targetWidth, targetHeight);
      chunk.videoFrame.close(); // release right after used
      return new VideoFrame(canvas, { timestamp: chunk.videoFrame.timestamp });
    };

    const encodeStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const frame = await nextFrame();
          if (!frame) return controller.close();
          controller.enqueue(frame);
        }
      },
    });

    const encodeSource = await fflow.source(encodeStream, { frameRate });

    const sourceGroup: (TrackGroup | Track)[] = [encodeSource];
    if (video.filter('audio').tracks().length > 0) {
      sourceGroup.push(video.filter('audio').tracks()[0]);
    }
    const blob = await fflow.group(sourceGroup).exportTo(Blob, {
      format: 'mp4',
      progress: () => {},
      worker: fflow.load({ newWorker: true }),
    });

    return new Uint8Array(await blob.arrayBuffer());
  };

  return {
    transcoding,
  };
}
