/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'randomuser.me'],
  },
  experimental: {
    reactRoot: true,
    suppressHydrationWarning: true,
  },
  output: 'export', // Enables static export
  trailingSlash: true, // Ensures proper routing for static deployment
};

module.exports = nextConfig;
