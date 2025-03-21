'use client'

import React from 'react'
import NoSSRWrapper from '@/components/NoSSRWrapper'

export default function OpenCVLoadTestLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NoSSRWrapper>
      {children}
    </NoSSRWrapper>
  )
}
