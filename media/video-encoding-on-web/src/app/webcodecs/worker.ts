import {calculateRotation} from '@/lib/mp4box/helper';
import {createFile, DataStream, MP4ArrayBuffer, MP4File, MP4Info, MP4VideoTrack, Sample} from 'mp4box';

export type MessageData = {
  source: File;
};

self.onmessage = async (e: MessageEvent<MessageData>) => {
  const data = e.data;
  console.log('run worker', data);

  const url = URL.createObjectURL(e.data.source);
  fetch(url).then((response) => {
    response.body?.pipeTo(new WritableStream(createUnderlyingSinker(), { highWaterMark: 2 }));
  });
};

function createUnderlyingSinker(): UnderlyingSink<Uint8Array<ArrayBufferLike>> {
  const mp4file = createFile();
  const mp4fileSink = new MP4FileSink(mp4file);
  const mp4Demuxer = new MP4Demuxer(mp4file, {
    onConfig(config): void {
      console.log('onConfig', config);
    },
    onChunk(chunk): void {},
  });

  return mp4fileSink;
}

// Wraps an MP4Box File as a WritableStream underlying sink.
class MP4FileSink implements UnderlyingSink<Uint8Array<ArrayBufferLike>> {
  #file: MP4File;
  #offset = 0;

  constructor(file: MP4File) {
    this.#file = file;
  }

  write(chunk: Uint8Array<ArrayBufferLike>) {
    // MP4Box.js requires buffers to be ArrayBuffers, but we have a Uint8Array.
    const buffer = new ArrayBuffer(chunk.byteLength) as MP4ArrayBuffer;
    new Uint8Array(buffer).set(chunk);

    // Inform MP4Box where in the file this chunk is from.
    buffer.fileStart = this.#offset;
    this.#offset += buffer.byteLength;

    // Append chunk.
    this.#file.appendBuffer(buffer);
  }

  close() {
    this.#file.flush();
  }
}

type MP4DemuxerOnConfig = (config: VideoDecoderConfig & { rotation: number }) => void;
type MP4DemuxerOnChunk = (chunk: EncodedVideoChunk) => void;

type MP4DemuxerCallbacks = {
  onConfig: MP4DemuxerOnConfig;
  onChunk: MP4DemuxerOnChunk;
};

class MP4Demuxer {
  #onConfig: MP4DemuxerOnConfig;
  #onChunk: MP4DemuxerOnChunk;
  #file: MP4File;

  constructor(file: MP4File, { onConfig, onChunk }: MP4DemuxerCallbacks) {
    this.#onConfig = onConfig;
    this.#onChunk = onChunk;

    // Configure an MP4Box File for demuxing.
    this.#file = file;
    this.#file.onError = (error) => {
      console.log('MP4Demuxer error:', error);
    };
    this.#file.onReady = this.#onReady.bind(this);
    this.#file.onSamples = this.#onSamples.bind(this);
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
    const track = info.videoTracks[0];
    const audio = info.audioTracks[0];

    // Generate and emit an appropriate VideoDecoderConfig.
    this.#onConfig({
      // Browser doesn't support parsing full vp8 codec (eg: `vp08.00.41.08`),
      // they only support `vp8`.
      codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
      codedHeight: track.video.height,
      codedWidth: track.video.width,
      description: this.#description(track),
      rotation: calculateRotation(this.#file.getTrackById(track.id).tkhd?.matrix),
    });

    // Start demuxing.
    this.#file.setExtractionOptions(track.id);
    this.#file.setExtractionOptions(audio.id);
    this.#file.start();
  }

  #onSamples(id: number, user: unknown, samples: Sample[]) {
    console.log('onSamples', id, user, samples);
    // Generate and emit an EncodedVideoChunk for each demuxed sample.
    // for (const sample of samples) {
    //   this.#onChunk(
    //     new EncodedVideoChunk({
    //       type: sample.is_sync ? 'key' : 'delta',
    //       timestamp: (1e6 * sample.cts) / sample.timescale,
    //       duration: (1e6 * sample.duration) / sample.timescale,
    //       data: sample.data,
    //     }),
    //   );
    // }
  }
}
