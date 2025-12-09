const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname);

// Add SVG transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
  ...config.resolver,
  assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
};

module.exports = config;
