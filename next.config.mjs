/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone", // Untuk memastikan bisa dijalankan di Vercel
    experimental: {
      appDir: true, // Pastikan Next.js tahu kamu pakai App Router
    },
    reactStrictMode: true, // Mode strict untuk debugging lebih baik
  };
  
  export default nextConfig;
  