import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LittleTalk",
  description: "Little. Talk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full">{children}</body>
    </html>
  );
}
