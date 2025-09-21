# Santelle - Women's Health Testing App

A React Native mobile application built with Expo for women's health biomarker testing and tracking.

## Overview

Santelle is a comprehensive health testing app that allows users to perform and track various vaginal health biomarkers including pH levels, hydrogen peroxide, leukocyte esterase, sialidase, beta-glucuronidase, and N-acetyl-β-D-glucosaminidase. The app provides educational content, test result tracking, and personalized health insights.

## Features

- **Health Testing**: Interactive test sessions with guided questionnaires and timer-based testing
- **Biomarker Tracking**: Monitor key vaginal health indicators over time
- **Educational Content**: Learn about biomarkers and their significance for women's health
- **Test Results**: View and analyze test results with detailed explanations
- **User Authentication**: Secure signup and login with email verification
- **Onboarding Flow**: Multi-step user onboarding including country selection, date of birth, and legal agreements
- **Real-time Notifications**: Get notified when test results are ready
- **Haptic Feedback**: Enhanced user experience with tactile feedback

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **UI/UX**: Custom components with React Native Reanimated
- **Animations**: Lottie for loading animations
- **Icons**: Custom SVG icons
- **Styling**: StyleSheet with custom theme system

## Project Structure

```
apps/app/
├── (auth)/                 # Authentication screens
│   ├── landing.tsx
│   ├── email.tsx
│   ├── otp.tsx
│   ├── signup.tsx
│   └── onboarding/         # Multi-step onboarding
├── (tabs)/                 # Main app tabs
│   ├── home.tsx           # Dashboard
│   ├── tests.tsx          # Test management
│   ├── insights.tsx       # Health insights
│   └── education.tsx      # Educational content
├── log-test/              # Test execution flow
│   ├── questionnaire.tsx
│   └── test.tsx
└── src/
    ├── components/        # Reusable UI components
    ├── features/          # Feature-specific logic
    ├── services/          # API and external services
    └── theme/            # Design system
```

## Key Components

- **WelcomeCard**: Main dashboard card with test status and actions
- **ArticleCard**: Educational content display
- **TestTimerCard**: Interactive test timing interface
- **TestResultModal**: Detailed test result display
- **CustomIcon**: SVG icon system
- **ScreenBackground**: Consistent app theming

## Development

### Prerequisites

- Node.js
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Setup

1. Install dependencies:
   ```bash
   cd apps
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

### Environment

The app uses Supabase for backend services. Configure your environment variables for:
- Supabase URL
- Supabase Anon Key
- Push notification settings

## Testing

The app includes comprehensive test logging and session management:
- Test session state management with Zustand
- Real-time test progress tracking
- Result analysis and storage
- Historical test data retrieval

## Deployment

Configured for deployment with:
- EAS Build for app store distribution
- Supabase Edge Functions for serverless backend
- Static web output support

## License

Private project - All rights reserved
