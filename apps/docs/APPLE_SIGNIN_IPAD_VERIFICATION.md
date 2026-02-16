# Sign in with Apple on iPad – Verification Checklist

Use this checklist to verify the fix and troubleshoot further if Apple Sign-In still fails on iPad.

---

## Fixes already in place

### 1. keyWindow → connectedScenes (iPad presentation anchor)

**Issue:** `expo-apple-authentication` uses deprecated `UIApplication.shared.keyWindow`, which can be `nil` on iPad.

**Fix:** Replaced with `connectedScenes`-based window lookup for iOS 13+.

**How it’s applied:**

- **patch-package** – applies during `npm install` (postinstall). Ensures the fix is in `node_modules` before prebuild.
- **withAppleAuthIpadFix** plugin – runs during prebuild. If the patch is missing, this plugin applies the same fix.

**Verification:** After `npm install`, check:

```bash
grep -A 3 "presentationAnchor" apps/node_modules/expo-apple-authentication/ios/AppleAuthenticationRequest.swift
```

You should see `connectedScenes` (not `keyWindow`) in the implementation.

---

### 2. EAS prebuild forced (.easignore)

**Issue:** When the `ios` folder is uploaded, EAS skips prebuild. The config plugin then never runs.

**Fix:** Added `apps/.easignore` with `ios/` so `ios` is excluded from uploads and prebuild runs.

**Verification:** Confirm `apps/.easignore` exists and contains `ios/`.

---

### 3. Apple Sign-In enabled in app config

**Config:** `ios.usesAppleSignIn: true` and `expo-apple-authentication` in plugins in `apps/app.json`.

---

## Other possible causes

### 4. Supabase Apple provider configuration (fixes "Unacceptable audience in id_token")

**Error:** `Unacceptable audience in id_token: [host.exp.Exponent]`

**Cause:** Supabase validates the Apple id_token’s `aud` claim against configured Client IDs. In Expo Go or a dev/simulator build, the audience is `host.exp.Exponent`, not your app’s bundle ID.

**Fix:** Add **both** identifiers to Apple’s Client IDs in Supabase, comma‑separated:

1. Supabase Dashboard → **Authentication** → **Providers** → **Apple**
2. In **Client IDs**, enter:  
   `com.gabrielkotovsky.SantelleApp,host.exp.Exponent`
3. Save

- `com.gabrielkotovsky.SantelleApp` – production / TestFlight / device builds
- `host.exp.Exponent` – Expo Go and dev/simulator builds

For native-only apps, you usually only need Client IDs. Services ID and secret are for web OAuth.

---

### 5. Apple Developer Console

**Check:** [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles → Identifiers.

- App ID `com.gabrielkotovsky.SantelleApp` has **Sign in with Apple** enabled in Capabilities.

---

### 6. Expo Go / simulator vs production

**Expo Go & simulator:** Apple tokens use audience `host.exp.Exponent`. Add it to Supabase Apple Client IDs (see §4).

**Production (TestFlight / App Store):** Tokens use `com.gabrielkotovsky.SantelleApp`. Add both for testing across environments.

---

### 7. Supabase OIDC issuer (Apple)

Apple’s issuer can be `appleid.apple.com` or `account.apple.com`. Supabase PR #2068 (merged July 2025) addresses this. If using an older Supabase version, upgrading might help.

---

### 8. App runs in iPhone compatibility mode on iPad

**Config:** `ios.supportsTablet: false` in `app.json`, so the app runs in iPhone compatibility mode on iPad.

The `connectedScenes` fix is intended to handle this. If it still fails, report the exact error and we can explore other compatibility-mode issues.

---

### 9. Multi-window / Split View on iPad

If the user has the app in Split View or Slide Over, multiple scenes can be active. The fix uses `foregroundActive` and `isKeyWindow` to pick a window. If you see issues only in multi-window setups, we may need to refine the window selection.

---

### 10. Plugin `projectRoot` on EAS

The plugin expects `projectRoot` to be the app directory. In typical EAS builds this should be correct. With patch-package in place, the fix is applied during `npm install` even if the plugin path is wrong.

---

## Build and submit flow

1. Ensure `apps/.easignore` contains `ios/`.
2. Run:  
   `cd apps && npm run build:testflight`
3. In App Store Connect Resolution Center, ask Apple for:
   - The exact error message or crash logs
   - Device model and iOS version

---

## Quick commands

```bash
# Verify patch is applied
grep connectedScenes apps/node_modules/expo-apple-authentication/ios/AppleAuthenticationRequest.swift

# Re-apply patches after npm install
cd apps && npx patch-package

# New TestFlight build
cd apps && npm run build:testflight
```
