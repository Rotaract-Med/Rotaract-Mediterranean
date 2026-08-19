/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/w320/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings about large strings (base64 PDF images)
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  // Increase API route body size limit for file uploads
  // Note: Vercel has a hard limit of 4.5MB for serverless functions
  experimental: {
    // jsdom (pulled in by isomorphic-dompurify for server-side sanitization,
    // see lib/sanitize.ts) transitively depends on html-encoding-sniffer,
    // which as of v6 requires the ESM-only @exodus/bytes package. Webpack's
    // static bundling of that require() chain breaks with ERR_REQUIRE_ESM;
    // externalizing leaves it to Node's own module resolution at runtime,
    // same reason @aws-sdk/* is listed here.
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/lib-storage', 'jsdom', 'isomorphic-dompurify'],
  },
};

export default nextConfig;
