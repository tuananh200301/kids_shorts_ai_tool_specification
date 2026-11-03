import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'AI Kids Shorts Harvester & Script Generator (5-7s)',
  description:
    'Harvest trending YouTube Kids topics and generate 5-7 second seamless looping animation concepts with Midjourney and Kling prompts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-200">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
