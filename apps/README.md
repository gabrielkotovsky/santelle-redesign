# Santelle - Women's Health Testing App

A React Native mobile application built with Expo for women's health testing and monitoring. The app provides a comprehensive platform for users to conduct health tests, track results, and access educational content.

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: React Native StyleSheet with custom theme system
- **Animations**: React Native Reanimated 3
- **Icons**: Custom SVG icons + Expo Vector Icons
- **Authentication**: Supabase Auth (Email OTP + Apple Sign-In)

### Project Structure
```
apps/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Authentication flow screens
│   │   ├── landing.tsx          # Sign-in options (Email/Apple)
│   │   ├── email.tsx            # Email input screen
│   │   ├── otp.tsx              # OTP verification screen
│   │   └── onboarding/          # User onboarding flow
│   ├── (tabs)/                   # Main app tab navigation
│   │   ├── home.tsx             # Dashboard with test status
│   │   ├── tests.tsx            # Test history and management
│   │   ├── insights.tsx         # Health insights and analytics
│   │   └── education.tsx        # Educational content
│   ├── log-test/                 # Test execution flow
│   │   ├── questionnaire.tsx    # Pre-test questionnaire
│   │   └── test.tsx             # Test step-by-step execution
│   ├── _layout.tsx              # Root layout with auth check
│   └── index.tsx                # App entry point with routing
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── animations/          # Custom animation components
│   │   ├── buttons/             # Button components (Apple/Email sign-in)
│   │   ├── home/                # Home screen specific components
│   │   ├── icons/               # Custom SVG icon system
│   │   ├── layout/              # Layout components (ScreenBackground)
│   │   ├── modals/              # Modal components (test results, articles)
│   │   ├── steps/               # Test step components
│   │   └── tests/               # Test-related components
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                # Authentication logic
│   │   │   ├── auth.api.ts      # Auth API calls (Supabase)
│   │   │   ├── auth.store.ts    # Auth state management (empty)
│   │   │   └── useSession.ts    # Session hook
│   │   ├── test-logs/           # Test history and results
│   │   └── test-session/        # Active test session management
│   │       ├── testSession.api.ts    # Test session API calls
│   │       ├── testSession.store.ts  # Test session state (Zustand)
│   │       └── sessionHydrator.tsx   # Session sync component
│   ├── services/                 # External service integrations
│   │   ├── supabase.ts          # Supabase client configuration
│   │   ├── devAuth.ts           # Development authentication
│   │   ├── notifications.ts     # Push notification handling
│   │   └── analyze-results.ts   # Test result analysis
│   ├── theme/                    # Design system
│   │   ├── colors.tsx           # Color palette (light/dark mode)
│   │   └── fonts.tsx            # Typography system
│   └── utils/                    # Utility functions
├── assets/                       # Static assets
│   ├── animations/              # Lottie animation files
│   ├── fonts/                   # Custom font files
│   ├── icons/                   # SVG icon files
│   └── images/                  # Image assets
└── supabase/                    # Supabase configuration
    ├── config.toml              # Local Supabase config
    └── functions/               # Edge functions
        └── analyze-results/     # Test result analysis function
```

## 🔐 Authentication System

### Current Implementation
- **Email OTP**: Users enter email → receive OTP → verify code
- **Apple Sign-In**: Native Apple authentication with proper nonce handling
- **Session Management**: Automatic session persistence via AsyncStorage
- **Development Mode**: Dev authentication for testing (currently active)

### Authentication Flow
1. **Landing Page** → User chooses authentication method
2. **Email Flow**: Email input → OTP verification → Main app
3. **Apple Flow**: Direct authentication → Main app
4. **Session Persistence**: Automatic session restoration on app launch

### Key Files
- `src/features/auth/auth.api.ts` - Authentication API calls
- `src/features/auth/useSession.ts` - Session state hook
- `src/services/supabase.ts` - Supabase client configuration
- `app/(auth)/` - Authentication screens

### Known Issues
- Authentication check is bypassed in `app/index.tsx` (line 10)
- OTP resend functionality is incomplete
- Auth state management store is empty

## 🧪 Test Session System

### Architecture
The test session system manages the complete lifecycle of health tests:

1. **Session Creation**: Creates a new test session in Supabase
2. **Step Management**: Tracks current test step and progress
3. **Result Storage**: Saves test results and timestamps
4. **Session Completion**: Marks sessions as completed or aborted

### Key Components
- **TestSession API** (`src/features/test-session/testSession.api.ts`): Database operations
- **TestSession Store** (`src/features/test-session/testSession.store.ts`): Zustand state management
- **Session Hydrator** (`src/features/test-session/sessionHydrator.tsx`): Syncs local state with server

### Test Flow
1. **Questionnaire** → Pre-test questions (period, intercourse)
2. **Test Execution** → Step-by-step test process
3. **Result Analysis** → AI-powered result interpretation
4. **History Tracking** → Test log storage and retrieval

### Critical Bug
⚠️ **The `createSession` function uses a hardcoded user ID instead of the authenticated user's ID** (line 41 in `testSession.api.ts`). This prevents proper user association with test sessions.

## 🎨 Design System

### Color Palette
```typescript
Colors = {
  light: {
    pearl: '#FABDD7',    // Light pink
    flow: '#FD9EAA',     // Medium pink
    blush: '#EF7D88',    // Dark pink
    rush: '#721422',     // Deep burgundy (primary)
    dune: '#FFEBCE',     // Cream
    text: '#000000',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E0E0E0',
  },
  dark: { /* Dark mode variants */ }
}
```

### Typography
- **Primary Font**: Chunko-Bold (headings)
- **Body Font**: Poppins (Regular, Medium, SemiBold)
- **Custom Font Loading**: Configured in `app/_layout.tsx`

### Component Architecture
- **ScreenBackground**: Consistent background across all screens
- **Custom Icons**: SVG-based icon system with TypeScript support
- **Animations**: React Native Reanimated for smooth interactions
- **Haptic Feedback**: Integrated throughout the app for better UX

## 🗂️ State Management

### Zustand Stores
1. **Test Session Store** (`testSession.store.ts`):
   - Manages active test sessions
   - Handles session creation, updates, and completion
   - Persists state to AsyncStorage
   - Optimistic updates with rollback on errors

2. **Auth Store** (`auth.store.ts`):
   - Currently empty - needs implementation
   - Should manage user authentication state

### Session Hydration
The `SessionHydrator` component ensures data consistency:
- Syncs local state with server on app launch
- Refreshes data when app comes to foreground
- Updates on screen focus changes

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Environment Variables
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_DEV_EMAIL=dev@example.com  # Optional: for dev auth
EXPO_PUBLIC_DEV_PASSWORD=dev_password  # Optional: for dev auth
```

### Installation
```bash
npm install
npx expo start
```

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## 🔧 Key Features

### 1. Health Testing
- Pre-test questionnaire for accurate results
- Step-by-step test execution with timers
- Real-time progress tracking
- Result analysis and interpretation

### 2. Test History
- Complete test log storage
- Historical data visualization
- Test result summaries
- Health trend tracking

### 3. Educational Content
- Health articles and insights
- Test result explanations
- Wellness recommendations
- Educational resources

### 4. User Experience
- Smooth animations and transitions
- Haptic feedback integration
- Offline-capable with sync
- Dark/light mode support

## 🐛 Known Issues & TODOs

### Critical Issues
1. **Authentication Bypass**: App always redirects to landing page
2. **Hardcoded User ID**: Test sessions not associated with authenticated users
3. **Incomplete OTP Resend**: Resend functionality not implemented

### Missing Features
1. **Auth State Management**: `auth.store.ts` is empty
2. **Post-Auth Flow**: No onboarding integration after authentication
3. **Sign-Out**: No sign-out functionality in the app
4. **Error Boundaries**: Limited error handling for auth failures

### Development TODOs
1. Enable authentication check in `app/index.tsx`
2. Fix `createSession` to use authenticated user ID
3. Complete OTP resend functionality
4. Implement auth state management
5. Add proper error handling and user feedback

## 📱 App Navigation

### Route Structure
```
/ (index) → Authentication check
├── /(auth)/ → Authentication flow
│   ├── /landing → Sign-in options
│   ├── /email → Email input
│   ├── /otp → OTP verification
│   └── /onboarding/ → User onboarding
├── /(tabs)/ → Main app
│   ├── /home → Dashboard
│   ├── /tests → Test management
│   ├── /insights → Health insights
│   └── /education → Educational content
└── /log-test/ → Test execution
    ├── /questionnaire → Pre-test questions
    └── /test → Test execution
```

### Navigation Patterns
- **File-based routing** with Expo Router
- **Stack navigation** for auth flow
- **Tab navigation** for main app
- **Modal presentation** for overlays

## 🔒 Security Considerations

### Authentication
- Supabase handles secure authentication
- OTP-based email verification
- Apple Sign-In with proper nonce handling
- Session tokens stored securely in AsyncStorage

### Data Protection
- User data encrypted in transit and at rest
- Row-level security policies in Supabase
- Secure API endpoints with authentication
- No sensitive data in client-side code

## 🚀 Deployment

### Build Configuration
- **EAS Build**: Configured for iOS and Android
- **App Store**: iOS app store deployment ready
- **Play Store**: Android app store deployment ready
- **Web**: Static web deployment supported

### Environment Management
- Development, staging, and production environments
- Environment-specific Supabase projects
- Secure environment variable management

## 📚 Additional Resources

### Documentation
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent file naming conventions
- Component-based architecture

---

This README provides a comprehensive overview of the Santelle app architecture. For specific implementation details, refer to the individual files and their inline documentation.
