# TestFlight Build Setup

## Prerequisites
1. Apple Developer Account
2. App Store Connect app created
3. EAS CLI installed (`npm install -g eas-cli`)
4. Logged into EAS (`eas login`)

## Configuration Files Updated
- `eas.json` - Added `testflight` build profile
- `app.json` - Added iOS `buildNumber`

## Before Building

### 1. Update Submit Configuration
Edit `apps/eas.json` and replace placeholders in the `submit.testflight.ios` section:

```json
"submit": {
  "testflight": {
    "ios": {
      "appleId": "your-apple-id@email.com",      // Your Apple ID email
      "ascAppId": "your-app-store-connect-app-id", // App Store Connect App ID (numeric)
      "appleTeamId": "your-team-id"               // Your Apple Developer Team ID
    }
  }
}
```

**How to find these values:**
- **Apple ID**: Your Apple Developer account email
- **ascAppId**: In App Store Connect → Apps → Your App → App Information → Apple ID (10-digit number)
- **appleTeamId**: In App Store Connect → Membership → Team ID

### 2. Ensure Certificates are Set Up
Run this to ensure you have the proper credentials:
```bash
cd apps
eas credentials
```

## Building for TestFlight

### Build the App
```bash
cd apps
eas build --platform ios --profile testflight
```

This will:
- Build a Release version of your app
- Auto-increment the build number
- Create an IPA file optimized for TestFlight
- Tag the build with the "testflight" channel

### Submit to TestFlight
After the build completes successfully:

```bash
cd apps
eas submit --platform ios --profile testflight
```

Or submit the latest build automatically:
```bash
cd apps
eas submit --platform ios --latest --profile testflight
```

## Alternative: Build and Submit in One Command
```bash
cd apps
eas build --platform ios --profile testflight --auto-submit
```

## Monitoring Builds
- View build status: `eas build:list`
- View specific build: `eas build:view [BUILD_ID]`
- Monitor in browser: https://expo.dev/accounts/gabrielkotovsky/projects/santelle-remastered/builds

## After Submission
1. Go to App Store Connect (https://appstoreconnect.apple.com)
2. Navigate to TestFlight tab
3. Add internal or external testers
4. Distribute your build

## Build Profiles Comparison

| Profile | Use Case | Distribution |
|---------|----------|-------------|
| `development` | Local development with dev client | Internal |
| `preview` | Quick internal testing | Internal |
| `testflight` | Beta testing via TestFlight | Internal |
| `production` | App Store release | Store |

## Tips
- TestFlight builds auto-increment the build number
- Maximum 100 internal testers (no review required)
- Maximum 10,000 external testers (requires Apple review)
- Builds expire after 90 days
- You can have up to 100 active builds in TestFlight

## Troubleshooting

### Missing credentials
```bash
eas credentials
```

### Build fails
Check logs:
```bash
eas build:view [BUILD_ID]
```

### Clear credentials and start fresh
```bash
eas credentials --clear-all
```

