require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL_LOCAL: process.env.BACKEND_URL_LOCAL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

module.exports = nextConfig;
