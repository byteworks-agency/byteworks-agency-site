import type { NextConfig } from 'next';

const nextConfig: NextConfig & { allowedDevOrigins?: string[] } = {
  webpack(config: any) {
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.100.129:3000',
  ],
};

export default nextConfig;