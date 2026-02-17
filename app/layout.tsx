import { GoogleAnalytics } from '@next/third-parties/google';
import { FacebookPixelEvents } from 'components/FacebookPixel';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';
import './globals.css';

const { SITE_NAME } = process.env;
const baseUrl = process.env.SHOP_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

const googleTag = process.env.googleTag;
const googleAnalytics = process.env.googleAnalytics;
const defaultOgImage = new URL('/logoNegro.png', baseUrl);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Proyecto 705 – Broqueles de Oro',
    template: '%s | Proyecto 705',
  },
  description:
    'Compra broqueles de oro 10k y 14k en Proyecto 705. Envíos gratis en compras mayores a $1,500 MXN y meses sin intereses.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: 'Proyecto 705',
    title: 'Proyecto 705 - Broqueles de Oro',
    description:
      'Tienda en línea de broqueles de oro 10k y 14k. Envíos gratis en compras mayores a $1,500 MXN.',
    images: [
      {
        url: defaultOgImage, // usa URL absoluta si sirves desde CDN
        width: 1200,
        height: 630,
        alt: 'Broqueles de oro - Proyecto 705',
      },
    ],
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyecto 705 - Broqueles de Oro',
    description: 'Broqueles de oro 10k y 14k. Envíos gratis en compras mayores a $1,500 MXN.',
    images: [defaultOgImage],
    creator: '@proyecto705',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Proyecto 705',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://web.facebook.com/people/Proyecto-705-Joyeria/61571068417335/',
      'https://www.instagram.com/proyecto705/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'MX',
      availableLanguage: ['es'],
    },
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Proyecto 705',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html>
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "viwxmr8t1y");
          `}
        </Script>
      </head>
      <body className="select-none bg-white text-black">
        <main>{children}</main>
        <FacebookPixelEvents />
        <GoogleAnalytics gaId={googleAnalytics || ''} />
        {/* Schema.org (Organization) */}
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        {/* Schema.org (WebSite) */}
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </body>
    </html>
  );
}
