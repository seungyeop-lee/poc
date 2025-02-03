'use client';

import Home from '@/app/Home';
import NoSSRWrapper from '@/app/NoSSRWrapper';

export default function Page() {
  return (
    <NoSSRWrapper>
      <Home />
    </NoSSRWrapper>
  );
}
