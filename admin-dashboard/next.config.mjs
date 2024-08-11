/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    FRAME_DEBUGGER_URL: process.env.FRAME_DEBUGGER_URL,
  },
};

export default nextConfig;
