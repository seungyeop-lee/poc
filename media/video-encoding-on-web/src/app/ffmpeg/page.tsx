'use client';

import NoSSRWrapper from '@/components/NoSSRWrapper';
import FFmpegHome from "@/app/ffmpeg/Home";

export default function FFmpegPage() {
  return (
    <NoSSRWrapper>
      <FFmpegHome />
    </NoSSRWrapper>
  );
}
