/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'pokeapi.co' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
