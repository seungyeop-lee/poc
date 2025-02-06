'use client';

import NoSSRWrapper from '@/components/NoSSRWrapper';
import WebcodecsApiHome from "@/app/webcodecs/Home";

export default function FFmpegPage() {
  return (
    <NoSSRWrapper>
      <WebcodecsApiHome />
    </NoSSRWrapper>
  );
}
