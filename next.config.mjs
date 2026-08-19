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
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/lib-storage'],
  },
};

export default nextConfig;
