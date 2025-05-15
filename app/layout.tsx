import { GoogleAnalytics } from '@next/third-parties/google';
import { FacebookPixelEvents } from 'components/FacebookPixel';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';

const { SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="select-none bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <main>{children}</main>
        <Suspense>
          <FacebookPixelEvents />
        </Suspense>
      </body>
      <GoogleAnalytics gaId="G-ZT16CGTNYX" />
    </html>
  );
}
