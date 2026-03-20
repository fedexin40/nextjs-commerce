import type { MetadataRoute } from 'next';

const siteUrl = (process.env.SHOP_PUBLIC_URL ?? 'https://proyecto705.com.mx').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout-address', '/checkout-carrier', '/checkout-payment', '/user'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
