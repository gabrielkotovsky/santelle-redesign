const { withXcodeProject } = require('@expo/config-plugins');

/**
 * Config plugin to force iPhone-only (remove iPad from supported destinations).
 * Sets TARGETED_DEVICE_FAMILY = "1" in all iOS build configurations.
 * (1 = iPhone, 2 = iPad, "1,2" = both)
 */
function withIphoneOnly(config) {
  return withXcodeProject(config, async (config) => {
    const project = config.modResults;
    const configurations = project.pbxXCBuildConfigurationSection();

    for (const entry of Object.values(configurations || {})) {
      const buildSettings = entry?.buildSettings;
      if (buildSettings && typeof buildSettings.PRODUCT_NAME !== 'undefined') {
        // Skip tvOS targets (they use family 3)
        if (typeof buildSettings.TVOS_DEPLOYMENT_TARGET === 'undefined') {
          buildSettings.TARGETED_DEVICE_FAMILY = '"1"';
        }
      }
    }

    return config;
  });
}

module.exports = withIphoneOnly;
