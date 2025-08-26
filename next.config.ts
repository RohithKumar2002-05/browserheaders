//next.config.ts
import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest:'public',
  mode: 'InjectManifest',
  swSrc:'src/service-worker.js',
  sw: 'service-worker.js',
    disable: process.env.NODE_ENV === 'development',
  register: false,  // auto-register SW (or disable to handle manually)
  skipWaiting: true, // activate new SW immediately
  scope: '/',
},

)
const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
};

module.exports = withPWA(nextConfig);
