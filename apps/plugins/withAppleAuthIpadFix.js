const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to fix Sign in with Apple on iPad.
 * expo-apple-authentication uses UIApplication.shared.keyWindow which is deprecated
 * and returns nil on iPad (especially in iPhone compatibility mode).
 * This replaces it with connectedScenes-based window lookup for iOS 13+.
 */
function withAppleAuthIpadFix(config) {
  return withDangerousMod(config, ['ios', async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const filePath = path.join(
      projectRoot,
      'node_modules',
      'expo-apple-authentication',
      'ios',
      'AppleAuthenticationRequest.swift'
    );

    if (!fs.existsSync(filePath)) {
      console.warn('withAppleAuthIpadFix: AppleAuthenticationRequest.swift not found, skipping');
      return config;
    }

    let contents = fs.readFileSync(filePath, 'utf8');

    // Check if already patched
    if (contents.includes('connectedScenes')) {
      return config;
    }

    // Replace the keyWindow-based implementation with iPad-safe version
    const oldBlock = `  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
    guard let window = UIApplication.shared.keyWindow else {
      fatalError("Unable to present authentication modal because UIApplication.shared.keyWindow is not available")
    }
    return window
  }`;

    const newBlock = `  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
    // Use connectedScenes for iOS 13+ (fixes iPad + iPhone compatibility mode on iPad)
    // keyWindow is deprecated and can return nil on iPad
    if #available(iOS 13.0, *) {
      if let windowScene = UIApplication.shared.connectedScenes
        .compactMap({ $0 as? UIWindowScene })
        .first(where: { $0.activationState == .foregroundActive }),
        let window = windowScene.windows.first(where: { $0.isKeyWindow }) ?? windowScene.windows.first {
        return window
      }
    }
    // Fallback for older iOS
    if let window = UIApplication.shared.keyWindow {
      return window
    }
    fatalError("Unable to present authentication modal because no window is available")
  }`;

    if (!contents.includes(oldBlock)) {
      console.warn('withAppleAuthIpadFix: Could not find expected code block, skipping');
      return config;
    }

    contents = contents.replace(oldBlock, newBlock);
    fs.writeFileSync(filePath, contents);

    return config;
  }]);
}

module.exports = withAppleAuthIpadFix;
