import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/assets/**',
      },
    ],
    // Allow Next.js image optimizer to fetch from localhost (private IP)
    dangerouslyAllowSVG: false,
    unoptimized: process.env.NODE_ENV === 'development',
  },
});