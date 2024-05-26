/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {

        config.optimization.providedExports = false;
        config.optimization.usedExports = false;
        config.optimization.sideEffects = false;
      }
      return config;
    },
  };
  
  export default nextConfig;
  