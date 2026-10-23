import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    // Avoid jumping from 1200 to 1920px for laptop-sized full-width photos.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
  },
  experimental: { inlineCss: true },
  async redirects() {
    // Keep the public mirrors on one canonical HTTPS origin. Local health checks
    // use 127.0.0.1 and must continue to reach the application directly.
    return ["www.tverplazh.ru", "147.45.189.80"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host.replaceAll(".", "\\.") }],
      destination: "https://tverplazh.ru/:path*",
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
