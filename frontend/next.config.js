const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  // Renamed from experimental.serverComponentsExternalPackages in Next 15
  serverExternalPackages: ['mongodb'],
  // Old per-service "Behind the Work" pages were duplicates of the portfolio.
  async redirects() {
    return [
      ...['editing', 'design', '3d-ads', 'web-dev'].map((s) => ({
        source: `/agency/behind-the-work/${s}`,
        destination: `/agency/portfolio?service=${s}`,
        permanent: true,
      })),
      // "Newsroom" was renamed "Publication" — keep old links and shared URLs alive.
      { source: '/newsroom', destination: '/publication', permanent: true },
      { source: '/newsroom/:path*', destination: '/publication/:path*', permanent: true },
    ];
  },
  // Same-origin proxy to the NestJS API (no CORS, one public origin).
  async rewrites() {
    const api = (process.env.BACKEND_API_URL || 'http://localhost:4000').replace(/\/$/, '');
    return [{ source: '/backend-api/:path*', destination: `${api}/api/:path*` }];
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "https://oct20five.example.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
