import {RotatableSprite} from '@/app/webav/RotatableSprite';
import {getRotationByMp4BoxBinData} from '@/lib/mp4box/helper';
import {Combinator, MP4Clip} from '@webav/av-cliper';
import {MP4ArrayBuffer} from 'mp4box';

export type MessageData = {
  source: File;
};

export type ResultMessageData = {
  transcoded?: Blob;
};

self.onmessage = async (e: MessageEvent<MessageData>) => {
  const data = e.data;
  console.log('run worker', data);

  const encoded = await doMp4(data.source);
  self.postMessage({
    transcoded: encoded,
  } as ResultMessageData);
};

async function doMp4(source: File) {
  const url = URL.createObjectURL(source);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const mp4Clip = new MP4Clip((await fetch(url)).body!);
  // const cropVideoFrame = createCropVideoFrame(1820, 980, 100, 100);
  // mp4Clip.tickInterceptor = async (_, ret) => {
  //   if (!ret.video) return ret;
  //
  //   return {
  //     ...ret,
  //     video: await cropVideoFrame(ret.video),
  //   };
  // };
  await mp4Clip.ready;

  const buf = (await mp4Clip.getFileHeaderBinData()) as MP4ArrayBuffer;
  const rotation = getRotationByMp4BoxBinData(buf);
  console.log('rotation:', rotation);

  const { width, height } = mp4Clip.meta;
  // Set target dimensions
  const targetWidth = width > height ? 1280 : Math.ceil((width / height) * 1280);
  const targetHeight = width > height ? Math.ceil((height / width) * 1280) : 1280;

  // const [_, newMp4Clip] = await mp4Clip.split(30 * 1e6);
  const videoSpr = new RotatableSprite(mp4Clip, { width: targetWidth, height: targetHeight, rotation });
  // videoSpr.time.duration = 10 * 1e6;

  const com = new Combinator({
    width: videoSpr.getWidth(),
    height: videoSpr.getHeight(),
  });
  await com.addSprite(videoSpr);
  const stream = await com.output();
  return new Response(stream).blob();
}
