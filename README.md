# Santelle - Women's Health Testing App

A React Native mobile application built with Expo for at-home vaginal health biomarker testing, tracking, and personalized health insights.

## Overview

Santelle is a comprehensive health testing application that enables users to perform and track various vaginal health biomarkers including pH levels, hydrogen peroxide (H₂O₂), leukocyte esterase (LE), sialidase (SNA), beta-glucuronidase (β-G), and N-acetyl-β-D-glucosaminidase (NAG). The app provides educational content, test result tracking, AI-powered analysis, and personalized health insights based on biomarker patterns and contextual factors.

## Features

### Core Functionality

- **Interactive Test Sessions**: Guided test execution with timer-based workflows and step-by-step instructions
- **Biomarker Testing**: Track six key vaginal health indicators:
  - pH (numeric)
  - Hydrogen Peroxide (H₂O₂) - Protective flora levels
  - Leukocyte Esterase (LE) - Inflammation marker
  - Sialidase (SNA) - Bacterial Vaginosis (BV) marker
  - Beta-Glucuronidase (β-G) - Aerobic Vaginitis (AV) marker
  - N-Acetyl-β-D-Glucosaminidase (NAG) - Yeast/Trichomoniasis marker
- **Pre-test Questionnaire**: Contextual data collection through dynamic questionnaires
- **AI-Powered Analysis**: Multiple analysis functions using GPT models:
  - Result analysis with biomarker interpretation
  - Contextual factor analysis linking pretest answers to biomarker patterns
  - Cycle context analysis for menstrual cycle effects
  - Healthy environment recommendations

### User Experience

- **Authentication**: Email OTP and Apple Sign-In
- **Onboarding Flow**: Multi-step onboarding (country, name, year of birth)
- **Dashboard**: Home screen with welcome cards, test status, and quick actions
- **Test History**: View and analyze historical test results
- **Educational Content**: Articles and resources about vaginal health
- **Insights Tab**: Personalized health insights and recommendations
- **Real-time Notifications**: Get notified when test results are ready
- **Haptic Feedback**: Enhanced UX with tactile responses
- **Session Recovery**: Background session management and recovery

### Technical Features

- **Offline Support**: Session persistence and recovery
- **State Management**: Zustand stores with AsyncStorage persistence
- **Real-time Updates**: Supabase subscriptions for live data
- **Type Safety**: Full TypeScript implementation
- **Error Tracking**: Sentry integration for error monitoring
- **Responsive Design**: Custom theme system with consistent styling

## Tech Stack

### Frontend

- **Framework**: React Native 0.81.5 with Expo SDK 54
- **React**: 19.1.0
- **Navigation**: Expo Router 6.0.13 (file-based routing)
- **State Management**: Zustand 5.0.8 with persistence middleware
- **Animations**: 
  - React Native Reanimated 4.1.1
  - Lottie React Native 7.3.1
- **UI/UX Libraries**:
  - React Native Skia 2.2.12
  - Expo Blur 15.0.7
  - Expo Linear Gradient 15.0.7
- **Icons**: Custom SVG icon system
- **Storage**: AsyncStorage 2.2.0
- **Content Rendering**: 
  - React Native Markdown Display 7.0.2
  - React Native Render HTML 6.3.4

### Backend

- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Serverless Functions**: Supabase Edge Functions (Deno runtime)
- **AI Analysis**: OpenAI API (GPT models)
- **Error Monitoring**: Sentry 7.2.0

### Development Tools

- **TypeScript**: 5.9.2
- **ESLint**: 9.25.0 with Expo config
- **Build System**: EAS Build
- **Package Manager**: npm

## Project Structure

```
apps/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Authentication screens
│   │   ├── landing.tsx          # Landing page
│   │   ├── email.tsx            # Email sign-in
│   │   └── otp.tsx              # OTP verification
│   ├── (onboarding)/            # Onboarding flow
│   │   ├── country.tsx
│   │   ├── name.tsx
│   │   └── year.tsx
│   ├── (questionnaire)/         # Pre-test questionnaire screens
│   │   ├── confidence-level.tsx
│   │   ├── emotional-reaction.tsx
│   │   ├── gynecologist-satisfaction.tsx
│   │   ├── infection-frequency.tsx
│   │   ├── motivation.tsx
│   │   ├── reaction-to-discomfort.tsx
│   │   └── test-frequency.tsx
│   ├── (tabs)/                  # Main app tabs
│   │   ├── home.tsx             # Dashboard
│   │   ├── tests.tsx            # Test management
│   │   ├── insights.tsx         # Health insights
│   │   └── education.tsx        # Educational content
│   ├── log-test/                # Test execution flow
│   │   ├── context.tsx          # Context collection
│   │   ├── questionnaire.tsx    # Pre-test questionnaire
│   │   └── test.tsx             # Test execution
│   └── index.tsx                # Root redirect logic
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── animations/          # Lottie animations, touch handlers
│   │   ├── buttons/             # Sign-in buttons
│   │   ├── home/                # Dashboard-specific components
│   │   ├── icons/               # SVG icon system
│   │   ├── layout/              # Layout components
│   │   ├── modals/              # Modal components
│   │   ├── steps/               # Test step components
│   │   └── tests/               # Test-related components
│   │
│   ├── features/                # Feature modules
│   │   ├── articles/            # Educational content
│   │   ├── auth/                # Authentication logic
│   │   │   ├── auth.store.ts    # Zustand auth store
│   │   │   └── AuthHydrator.tsx # Auth initialization
│   │   ├── pre-test/            # Pre-test questionnaire
│   │   │   ├── api/             # API calls
│   │   │   └── hooks/           # Custom hooks
│   │   ├── test-logs/           # Test history management
│   │   └── test-session/        # Active test session management
│   │
│   ├── services/                # External services & utilities
│   │   ├── analyze-results.ts   # Result analysis service
│   │   ├── contextual-factors.ts
│   │   ├── cycle-context.ts
│   │   ├── gpt5-analyze-results.ts
│   │   ├── gpt5-context.ts
│   │   ├── healthy-environment.ts
│   │   ├── notifications.ts     # Push notification handling
│   │   ├── sessionRecovery.ts   # Session recovery logic
│   │   └── supabase.ts          # Supabase client setup
│   │
│   ├── hooks/                   # Shared custom hooks
│   │   └── useSupabaseRefresh.ts
│   │
│   ├── theme/                   # Design system
│   │   ├── colors.tsx           # Color palette
│   │   └── fonts.tsx            # Typography
│   │
│   └── utils/                   # Utility functions
│       └── splashScreen.ts
│
├── assets/                      # Static assets
│   ├── animations/              # Lottie JSON files
│   ├── fonts/                   # Custom fonts
│   ├── icons/                   # SVG icon sources
│   └── images/                  # Images and graphics

supabase/
├── functions/                   # Supabase Edge Functions
│   ├── analyze-results/         # Biomarker result analysis
│   ├── context/                 # Contextual factor analysis
│   ├── cycle-context/           # Menstrual cycle analysis
│   ├── gpt5_analyze_results/    # GPT-5 result analysis
│   ├── gpt5_context/            # GPT-5 contextual analysis
│   └── healthy-environment/     # Healthy environment recommendations
└── config.toml                  # Supabase configuration
```

## Development Setup

### Prerequisites

- **Node.js**: Version 16.19.3 or higher
- **npm**: Latest version
- **Expo CLI**: Install globally with `npm install -g expo-cli` (optional, included with project)
- **iOS Development**: Xcode (for iOS Simulator) - macOS only
- **Android Development**: Android Studio with Android SDK (for Android Emulator)
- **Supabase Account**: For backend services
- **OpenAI API Key**: For AI analysis features

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd santelle-redesign
   ```

2. **Install dependencies**
   ```bash
   cd apps
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `apps` directory with:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   For Edge Functions, configure in Supabase dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`

4. **Set up Supabase (local development)**

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Start local Supabase instance
   supabase start

   # Link to remote project (for production)
   supabase link --project-ref your-project-ref
   ```

### Running the App

1. **Start the development server**
   ```bash
   cd apps
   npm start
   ```

2. **Run on specific platforms**
   ```bash
   npm run ios       # iOS Simulator (macOS only)
   npm run android   # Android Emulator
   npm run web       # Web browser
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

## Architecture Overview

### State Management

- **Zustand Stores**: Feature-specific stores for auth, test sessions, etc.
- **Persistent Storage**: AsyncStorage integration for offline support
- **Reactive Updates**: Supabase real-time subscriptions for live data

### Routing

- **File-based Routing**: Expo Router with folder structure
- **Route Groups**: `(auth)`, `(tabs)`, `(onboarding)`, `(questionnaire)`
- **Navigation Guards**: Auth state checks in root `index.tsx`
- **Deep Linking**: Expo Linking for URL navigation

### Backend Architecture

- **Supabase Edge Functions**: Deno-based serverless functions
- **AI Analysis Pipeline**:
  1. Collect biomarkers and pretest answers
  2. Fetch contextual data (cycle info, symptoms)
  3. Send to OpenAI with structured prompts
  4. Parse and store structured JSON results
- **Database Schema**: PostgreSQL with Row Level Security (RLS)

### Key Services

- **Session Recovery**: Handles app backgrounding/foregrounding
- **Notification Service**: Push notifications for test results
- **Analysis Services**: Multiple GPT-powered analysis endpoints
- **Supabase Refresh**: Automatic token refresh handling

## Backend Functions

### Edge Functions

Located in `supabase/functions/`:

1. **analyze-results**: Analyzes biomarker results with ChatGPT
2. **context**: Analyzes contextual factors from pretest answers
3. **cycle-context**: Analyzes menstrual cycle effects on biomarkers
4. **gpt5_analyze_results**: GPT-5 powered result analysis
5. **gpt5_context**: GPT-5 powered contextual analysis
6. **healthy-environment**: Generates healthy environment recommendations

### Testing Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Test a function
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/context' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "test_session_id": "YOUR-SESSION-UUID"
  }'
```

## Biomarker System

The app tracks six biomarkers with the following interpretations:

- **pH** (3.8-4.4 ideal): Vaginal acidity level
- **H₂O₂**: Protective lactobacilli levels (- = good, + = low protection)
- **LE**: Inflammation marker (-/± = low, +/++/+++ = inflammation)
- **SNA**: BV marker (- = negative, ± = possible, + = BV)
- **β-G**: AV marker (- = negative, ± = possible, + = AV)
- **NAG**: Yeast/Trich marker (- = negative, ± = possible, + = positive, combined with pH for diagnosis)

## Deployment

### EAS Build Configuration

The project uses EAS Build with profiles defined in `eas.json`:

- **development**: Development client builds
- **preview**: Internal distribution builds (APK for Android)
- **testflight**: TestFlight builds for iOS
- **production**: App Store / Play Store builds

### Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Deployment Checklist

- [ ] Update version in `app.json`
- [ ] Update build number for iOS
- [ ] Test all features in development build
- [ ] Verify environment variables in EAS
- [ ] Deploy Edge Functions to Supabase
- [ ] Run EAS build
- [ ] Submit to stores (if applicable)

## Contributing

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Keep components focused and reusable

### Git Workflow

1. Create a feature branch from `development`
2. Make your changes with clear commit messages
3. Test thoroughly on iOS and Android
4. Run linter: `npm run lint`
5. Create a pull request to `development`

### Pull Request Guidelines

- Clear description of changes
- Screenshots for UI changes (if applicable)
- Testing steps for reviewers
- Link related issues

### Testing Before Committing

- Test on both iOS and Android simulators/emulators
- Verify authentication flows
- Test test session creation and completion
- Verify API calls work correctly
- Check for TypeScript errors

## Environment Variables

### Required for App

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Required for Edge Functions

Configure in Supabase Dashboard → Edge Functions → Secrets:

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret!)
- `OPENAI_API_KEY`: OpenAI API key for GPT analysis

## Important Notes

### Data Privacy

- Health data is sensitive and protected
- Row Level Security (RLS) policies enforce user data isolation
- No PHI should be logged or exposed

### AI Analysis

- Analysis functions use structured JSON schemas
- Contextual analysis only uses factors from pretest answers
- No medical diagnosis - informational insights only
- Results stored in database for historical tracking

### Session Management

- Test sessions can be paused and resumed
- Session recovery handles app backgrounding
- State persisted to AsyncStorage for offline support

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npm start -- --clear
   ```

2. **iOS build errors**
   - Clean Xcode build folder
   - Reset iOS Simulator
   - Clear Expo cache: `expo start -c`

3. **Android build errors**
   - Clean Gradle: `cd android && ./gradlew clean`
   - Clear Android build cache

4. **Supabase connection issues**
   - Verify environment variables
   - Check Supabase project status
   - Verify RLS policies

5. **TypeScript errors**
   - Run `npm run lint` to see all errors
   - Check `tsconfig.json` paths are correct

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## License

Private project - All rights reserved

---

For questions or issues, please contact the development team or create an issue in the repository.
