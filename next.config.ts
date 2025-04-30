import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {

  },
  env: {
    SERVER_URL: process.env.SERVER_URL
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig;
