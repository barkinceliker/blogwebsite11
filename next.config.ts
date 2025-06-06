
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add the allowedDevOrigins configuration here
  experimental: {
    allowedDevOrigins: [
        "https://6000-firebase-studio-1749184259350.cluster-jbb3mjctu5cbgsi6hwq6u4btwe.cloudworkstations.dev",
        // You might need to add other origins if you use different preview environments
    ],
  },
};

export default nextConfig;
