import type {Metadata} from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Video Encoding on Browser Demo',
  description: 'Video Encoding on Browser Demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
