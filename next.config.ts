import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.tripadvisor.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.susercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'golook.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'andemkom9.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'amthucvanho.com.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pasgo.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.mediacdn.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hanoidep.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.onepas.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nhahangphungthanh.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'topgo.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thuanchay.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gcs.tripi.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hotel84.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chaca.com.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.happycow.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tuxtax.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vnecdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'congchungnguyenhue.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.hstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vcdn.cloud',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.xanhsm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vinwonders.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
