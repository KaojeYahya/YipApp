const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add 'cjs' to source extensions
  config.resolver.sourceExts.push('cjs');

  // Disable package exports flag if needed
  config.resolver.unstable_enablePackageExports = false;

  return config;
})();
