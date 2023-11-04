module.exports = function override(config, env) {
  // Your customizations here

  const originalFallback = config.resolve.fallback;
  config.resolve.fallback = {
    ...originalFallback,
    fs: false,
    path: false,
    crypto: false,
  };
  return config;
};
