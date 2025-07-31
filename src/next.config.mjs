/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
  output: "standalone",
};

export default nextConfig;
