import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    swcPlugins: [
      ["@lingui/swc-plugin", {}],
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "@lingui/loader"],
    });
    return config;
  },





  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'res.cloudinary.com'
    }, {
      protocol: 'https',
      hostname: 'www.flaticon.com'
    }, {
      protocol: 'https',
      hostname: 'cdn-icons-png.flaticon.com'
    }, {
      protocol: 'https',
      hostname: 'cdn-icons-flat.flaticon.com'
    }, {
      protocol: 'https',
      hostname: 'images.unsplash.com'
    }]
  }

};


export default nextConfig;
