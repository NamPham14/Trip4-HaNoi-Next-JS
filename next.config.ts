import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'mms.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'golook.vn',
      },
      {
        protocol: 'https',
        hostname: 'andemkom9.com',
      },
      {
        protocol: 'https',
        hostname: 'amthucvanho.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'pasgo.vn',
      },
      {
        protocol: 'https',
        hostname: 'suckhoedoisong.qltns.mediacdn.vn',
      },
      {
        protocol: 'https',
        hostname: 'hanoidep.vn',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pastaxi-manager.onepas.vn',
      },
      {
        protocol: 'https',
        hostname: 'nhahangphungthanh.vn',
      },
      {
        protocol: 'https',
        hostname: 'topgo.vn',
      },
      {
        protocol: 'https',
        hostname: 'thuanchay.vn',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
      },
      {
        protocol: 'https',
        hostname: 'gcs.tripi.vn',
      },
      {
        protocol: 'https',
        hostname: 'hotel84.com',
      },
      {
        protocol: 'https',
        hostname: 'chaca.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'images.happycow.net',
      },
      {
        protocol: 'https',
        hostname: 'tuxtax.vn',
      },
      {
        protocol: 'https',
        hostname: 'vcdn1-dulich.vnecdn.net',
      },
      {
        protocol: 'https',
        hostname: 'congchungnguyenhue.com',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'iguov8nhvyobj.vcdn.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cdn.xanhsm.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vinwonders.com',
      },
    ],
  },
};

export default nextConfig;
