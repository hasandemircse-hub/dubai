import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
let supabaseHost = "127.0.0.1";
try {
  supabaseHost = new URL(supabaseUrl).hostname;
} catch {
  supabaseHost = "127.0.0.1";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: supabaseHost },
      { protocol: "https", hostname: supabaseHost },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
