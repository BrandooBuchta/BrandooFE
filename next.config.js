require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PUBLIC_BACKEND_URL_PROD: 'api.brandoo.cz/api/',
    PUBLIC_BACKEND_URL_DEV: 'dev.api.brandoo.cz/api/',
    BACKEND_URL: 'http://localhost:8000/api/',
  },
};

module.exports = nextConfig;
