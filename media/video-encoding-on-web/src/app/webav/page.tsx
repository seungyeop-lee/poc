'use client';

import WebAVHome from '@/app/webav/Home';
import NoSSRWrapper from '@/components/NoSSRWrapper';

export default function FFmpegPage() {
  return (
    <NoSSRWrapper>
      <WebAVHome />
    </NoSSRWrapper>
  );
}
