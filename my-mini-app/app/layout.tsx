import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Adopt-a-Cow',
  description: 'A mini-app for adopting digital cows on the blockchain.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}