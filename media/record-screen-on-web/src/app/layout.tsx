import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "웹 기반 비디오 편집기",
  description: "비디오나 웹캠 영상에 이미지를 오버레이하여 새로운 비디오를 만드는 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
