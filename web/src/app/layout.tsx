'use client';

import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppStoreProvider } from '@store/AppStoreProvider';
import { AudioPlayerProvider, useAudioPlayer } from 'react-use-audio-player';
import { useEffect } from 'react';
import { AuthErrorProvider } from '@/components/auth-error-provider';

// Local primary font for all site text
const customSans = localFont({
  src: './mint.otf',
  variable: '--font-geist-sans',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { load, pause } = useAudioPlayer();

  useEffect(() => {
    load('audio/background.mp3', {
      initialVolume: 1,
      autoplay: true,
      loop: true,
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`${customSans.className} ${customSans.variable} ${geistMono.variable} antialiased w-screen min-h-screen`}
      >
        <AudioPlayerProvider>
          <AppStoreProvider>
            <AuthErrorProvider>{children}</AuthErrorProvider>
          </AppStoreProvider>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
