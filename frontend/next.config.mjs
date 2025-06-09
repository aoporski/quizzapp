/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/user/:path*",
        destination: "http://gateway:3001/api/user/:path*",
      },
      {
        source: "/api/quiz/:path*",
        destination: "http://gateway:3001/api/quiz/:path*",
      },
      {
        source: "/api/question/:path*",
        destination: "http://gateway:3001/api/question/:path*",
      },
      {
        source: "/api/session/:path*",
        destination: "http://gateway:3001/api/session/:path*",
      },
    ];
  },
};

export default nextConfig;
