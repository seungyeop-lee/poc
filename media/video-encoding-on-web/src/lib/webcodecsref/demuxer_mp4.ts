import {createFile, DataStream, MP4ArrayBuffer, MP4File, MP4Info, MP4VideoTrack, Sample} from 'mp4box'; // Wraps an MP4Box File as a WritableStream underlying sink.

export type MP4DemuxerOnConfig = (config: VideoDecoderConfig) => void;
export type MP4DemuxerOnChunk = (chunk: EncodedVideoChunk) => void;
export type MP4DemuxerSetStatus = (type: string, message: string) => void;

// Wraps an MP4Box File as a WritableStream underlying sink.
class MP4FileSink implements UnderlyingSink<Uint8Array<ArrayBufferLike>> {
  #setStatus: MP4DemuxerSetStatus;
  #file: MP4File;
  #offset = 0;

  constructor(file: MP4File, setStatus: MP4DemuxerSetStatus) {
    this.#file = file;
    this.#setStatus = setStatus;
  }

  write(chunk: Uint8Array<ArrayBufferLike>) {
    // MP4Box.js requires buffers to be ArrayBuffers, but we have a Uint8Array.
    const buffer = new ArrayBuffer(chunk.byteLength) as MP4ArrayBuffer;
    new Uint8Array(buffer).set(chunk);

    // Inform MP4Box where in the file this chunk is from.
    buffer.fileStart = this.#offset;
    this.#offset += buffer.byteLength;

    // Append chunk.
    this.#setStatus('fetch', `${(this.#offset / 1024 ** 2).toFixed(1)}MiB`);
    this.#file.appendBuffer(buffer);
  }

  close() {
    this.#setStatus('fetch', 'Done');
    this.#file.flush();
  }
}

export type MP4DemuxerCallbacks = {
  onConfig: MP4DemuxerOnConfig;
  onChunk: MP4DemuxerOnChunk;
  setStatus: MP4DemuxerSetStatus;
};

// Demuxes the first video track of an MP4 file using MP4Box, calling
// `onConfig()` and `onChunk()` with appropriate WebCodecs objects.
export class MP4Demuxer {
  #onConfig: MP4DemuxerOnConfig;
  #onChunk: MP4DemuxerOnChunk;
  #setStatus: MP4DemuxerSetStatus;
  #file: MP4File;

  constructor(uri: string, { onConfig, onChunk, setStatus }: MP4DemuxerCallbacks) {
    this.#onConfig = onConfig;
    this.#onChunk = onChunk;
    this.#setStatus = setStatus;

    // Configure an MP4Box File for demuxing.
    this.#file = createFile();
    this.#file.onError = (error) => setStatus('demux', error);
    this.#file.onReady = this.#onReady.bind(this);
    this.#file.onSamples = this.#onSamples.bind(this);

    // Fetch the file and pipe the data through.
    const fileSink = new MP4FileSink(this.#file, setStatus);
    fetch(uri).then((response) => {
      // highWaterMark should be large enough for smooth streaming, but lower is
      // better for memory usage.
      response.body?.pipeTo(new WritableStream(fileSink, { highWaterMark: 2 }));
    });
  }

  // Get the appropriate `description` for a specific track. Assumes that the
  // track is H.264, H.265, VP8, VP9, or AV1.
  #description(track: MP4VideoTrack) {
    const trak = this.#file.getTrackById(track.id);
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    for (const entry of trak.mdia?.minf?.stbl?.stsd?.entries!) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
      if (box) {
        const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
        box.write(stream);
        return new Uint8Array(stream.buffer, 8); // Remove the box header.
      }
    }
    throw new Error('avcC, hvcC, vpcC, or av1C box not found');
  }

  #onReady(info: MP4Info) {
    this.#setStatus('demux', 'Ready');
    const track = info.videoTracks[0];

    // Generate and emit an appropriate VideoDecoderConfig.
    this.#onConfig({
      // Browser doesn't support parsing full vp8 codec (eg: `vp08.00.41.08`),
      // they only support `vp8`.
      codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
      codedHeight: track.video.height,
      codedWidth: track.video.width,
      description: this.#description(track),
    });

    // Start demuxing.
    this.#file.setExtractionOptions(track.id);
    this.#file.start();
  }

  #onSamples(id: number, user: unknown, samples: Sample[]) {
    // Generate and emit an EncodedVideoChunk for each demuxed sample.
    for (const sample of samples) {
      this.#onChunk(
        new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: (1e6 * sample.cts) / sample.timescale,
          duration: (1e6 * sample.duration) / sample.timescale,
          data: sample.data,
        }),
      );
    }
  }
}
