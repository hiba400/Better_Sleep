/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Rewrites désactivés - on utilise directement l'URL complète dans api.ts
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://192.168.1.16:8081/api/:path*',
  //     },
  //   ];
  // },
}

export default nextConfig
