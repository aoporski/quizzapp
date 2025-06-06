/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/user/:path*",
        destination: "http://gateway:3001/api/user/:path*", // proxy to gateway
      },
    ];
  },
};

export default nextConfig;
