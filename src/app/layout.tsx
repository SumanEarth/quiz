import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GK Summary - Exam Prep Key Points | Chrome Extension Download",
  description: "Download GK Summary Chrome Extension - Summarize any webpage, extract key points, and generate quizzes for BCS, Bank Job, Admission & NTRCA exam preparation. Supports Bangla & English newspapers. 100% offline, privacy-first.",
  keywords: "Chrome extension, GK summary, exam prep, BCS preparation, Bank Job preparation, Bangla news summarizer, English news summarizer, key points extractor, quiz generator, competitive exam, NTRCA, admission test, Prothom Alo summarizer, Kaler Kantho summarizer",
  openGraph: {
    title: "GK Summary - Exam Prep Key Points",
    description: "Summarize any webpage, extract key points, and generate quizzes for competitive exam preparation. Supports Bangla & English newspapers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}