import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import LanguageSwitch from "./components/LanguageSwitch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "左手画方右手画圆 | Left Square Right Circle",
  description: "同时画方和圆，挑战你的左右脑协调能力！限时30秒，看看你有多厉害。/ Draw square and circle simultaneously, challenge your brain coordination! 30 seconds limit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <LanguageSwitch />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
