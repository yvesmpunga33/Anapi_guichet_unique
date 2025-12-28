import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
  // Externalize pg and sequelize for server-side rendering
  serverExternalPackages: [
    'pg',
    'pg-hstore',
    'pg-native',
    'sequelize',
    'pg-pool',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle these modules on the server
      config.externals = config.externals || [];
      config.externals.push({
        pg: 'commonjs pg',
        'pg-native': 'commonjs pg-native',
        'pg-hstore': 'commonjs pg-hstore',
        sequelize: 'commonjs sequelize',
      });
    }
    return config;
  },
};

export default nextConfig;
