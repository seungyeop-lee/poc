// Status UI. Messages are batched per animation frame.
import {MP4Demuxer} from "@/lib/webcodecsref/demuxer_mp4";
import {Renderer} from "@/lib/webcodecsref/types";
import {Canvas2DRenderer} from "@/lib/webcodecsref/renderer_2d";

let pendingStatus: { [k: string]: string } | null = null;

function setStatus(type: string, message: string) {
  if (pendingStatus) {
    pendingStatus[type] = message;
  } else {
    pendingStatus = { [type]: message };
    self.requestAnimationFrame(statusAnimationFrame);
  }
}

function statusAnimationFrame() {
  self.postMessage(pendingStatus);
  pendingStatus = null;
}

// Rendering. Drawing is limited to once per animation frame.
let renderer: Renderer | null = null;
let pendingFrame: VideoFrame | null = null;
let startTime: DOMHighResTimeStamp | null = null;
let frameCount = 0;

function renderFrame(frame: VideoFrame) {
  if (!pendingFrame) {
    // Schedule rendering in the next animation frame.
    requestAnimationFrame(renderAnimationFrame);
  } else {
    // Close the current pending frame before replacing it.
    pendingFrame.close();
  }
  // Set or replace the pending frame.
  pendingFrame = frame;
}

function renderAnimationFrame() {
  if (!pendingFrame) {
    return;
  }
  renderer?.draw(pendingFrame);
  pendingFrame = null;
}

export type StartParams = { dataUri: string; canvas: OffscreenCanvas };

// Startup.
function start({ dataUri, canvas }: StartParams) {
  renderer = new Canvas2DRenderer(canvas);

  // Set up a VideoDecoder.
  const decoder = new VideoDecoder({
    output(frame) {
      // Update statistics.
      if (startTime == null) {
        startTime = performance.now();
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        const fps = ++frameCount / elapsed;
        setStatus('render', `${fps.toFixed(0)} fps`);
      }

      // Schedule the frame to be rendered.
      renderFrame(frame);
    },
    error(e) {
      setStatus('decode', e.message);
    },
  });

  // Fetch and demux the media data.
  new MP4Demuxer(dataUri, {
    onConfig(config) {
      setStatus('decode', `${config.codec} @ ${config.codedWidth}x${config.codedHeight}`);
      decoder.configure(config);
    },
    onChunk(chunk) {
      decoder.decode(chunk);
    },
    setStatus,
  });
}

// Listen for the start request.
self.addEventListener('message', (message) => start(message.data), { once: true });
