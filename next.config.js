/** @type {import('next').NextConfig} */
module.exports = {
  cacheComponents: true,
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'api.proyecto705.com.mx' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.proyecto705.com' },
    ],
  },

  async headers() {
    return [
      // Cache largo para assets en /public (imágenes)
      {
        source: '/:path*\\.(avif|webp|png|jpg|jpeg|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache largo para fuentes
      {
        source: '/:path*\\.(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
