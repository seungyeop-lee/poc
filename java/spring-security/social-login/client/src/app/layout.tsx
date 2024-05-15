import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Login DEMO",
  description: "Social Login DEMO",
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
