# Santelle - Women's Health Testing App

A React Native mobile application built with Expo for at-home vaginal health biomarker testing, tracking, and personalized health insights.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Detailed File Documentation](#detailed-file-documentation)
   - [Root Level](#root-level)
   - [apps/ Directory](#apps-directory)
   - [apps/app/ - Screen Routes](#appsapp---screen-routes)
   - [apps/src/ - Source Code](#appssrc---source-code)
   - [supabase/ - Backend Functions](#supabase---backend-functions)
5. [User Flow](#user-flow)
6. [Database Tables](#database-tables)
7. [Environment Variables](#environment-variables)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)

---

## Overview

<<<<<<< Updated upstream
Santelle is a comprehensive health testing application that enables users to perform and track various vaginal health biomarkers including pH levels, hydrogen peroxide (H₂O₂), leukocyte esterase (LE), sialidase (SNA), beta-glucuronidase (β-G), and N-acetyl-β-D-glucosaminidase (NAG). The app provides educational content, test result tracking, AI-powered analysis, and personalized health insights based on biomarker patterns and contextual factors.
=======
Santelle is a comprehensive health testing app that allows users to perform and track various vaginal health biomarkers:
>>>>>>> Stashed changes

| Biomarker | Full Name | What It Tests |
|-----------|-----------|---------------|
| **pH** | Potential Hydrogen | Vaginal acidity (healthy range: 3.8-4.4) |
| **H₂O₂** | Hydrogen Peroxide | Good bacteria (lactobacilli) levels |
| **LE** | Leukocyte Esterase | White blood cell/inflammation activity |
| **SNA** | Sialidase | Bacterial Vaginosis (BV) marker |
| **β-G** | Beta-Glucuronidase | Aerobic Vaginitis (AV) marker |
| **NAG** | N-acetyl-β-D-glucosaminidase | Yeast/Trichomoniasis marker |

<<<<<<< Updated upstream
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
=======
The app guides users through a 7-step physical testing process with timers, captures results, and provides AI-powered analysis.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | Zustand with AsyncStorage persistence |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **Authentication** | Supabase Auth (Email OTP + Apple Sign-In) |
| **Animations** | React Native Reanimated + Lottie |
| **UI/UX** | expo-blur, expo-linear-gradient, expo-haptics |
| **Styling** | React Native StyleSheet + custom theme system |
| **AI Analysis** | OpenAI GPT-4o-mini via Supabase Edge Functions |

---
>>>>>>> Stashed changes

## Project Structure

```
<<<<<<< Updated upstream
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

=======
santelle-redesign/
├── README.md                    # This documentation file
├── apps/                        # Main application directory
│   ├── android/                 # Android native project (auto-generated)
│   ├── app/                     # Expo Router screens (file-based routing)
│   ├── assets/                  # Static assets (fonts, images, icons, animations)
│   ├── src/                     # Application source code
│   │   ├── components/          # Reusable UI components
│   │   ├── features/            # Feature modules (auth, test-session, etc.)
│   │   ├── services/            # External service integrations
│   │   └── theme/               # Design system (colors, fonts)
│   ├── app.json                 # Expo configuration
│   ├── eas.json                 # EAS Build configuration
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # TypeScript configuration
└── supabase/                    # Supabase configuration
    ├── config.toml              # Function configuration
    └── functions/               # Edge Functions
        └── analyze-results/     # AI analysis function
```

---

## Detailed File Documentation

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Project documentation (this file) |

---

### apps/ Directory

#### Configuration Files

| File | Purpose |
|------|---------|
| `app.json` | Expo project configuration: app name ("Santelle"), slug, version (2.0.0), iOS/Android settings, plugins (router, splash-screen), EAS project ID |
| `eas.json` | EAS Build profiles for development, preview, and production builds |
| `package.json` | NPM dependencies and scripts (`start`, `ios`, `android`, `web`, `lint`) |
| `tsconfig.json` | TypeScript configuration with path alias `@/*` mapping to `./*` |
| `eslint.config.js` | ESLint configuration for code linting |
| `expo-env.d.ts` | TypeScript declarations for Expo environment |
| `BUILD_STATUS.md` | Build documentation and status notes |
| `TESTFLIGHT_SETUP.md` | TestFlight deployment instructions |

#### android/ Directory

Auto-generated Android native project files. Key files:
- `app/src/main/AndroidManifest.xml` - App permissions and configuration
- `app/build.gradle` - Gradle build configuration
- `settings.gradle` - Project-level Gradle settings
- `res/` - Android resources (icons, drawables, values)

#### assets/ Directory

| Subdirectory | Contents |
|--------------|----------|
| `animations/` | `Loading.json` - Lottie animation for splash/loading states |
| `fonts/` | Custom fonts: `Chunko-Bold.otf` (brand headings), `Poppins-Regular.ttf`, `Poppins-Medium.ttf`, `Poppins-SemiBold.ttf` |
| `icons/` | SVG icons: `analytics.svg`, `apple.svg`, `arrow-left.svg`, `google.svg`, `house.svg`, `logo_cross.svg`, `logs.svg`, `mail.svg`, `S_logo.svg`, `user.svg`, `x.svg` |
| `images/` | `background-mobile.jpg` (app background), `icon.png` (app icon), `fig.png`/`fig1.png` (article images), `step1-6.png` (test instruction images) |

---

### apps/app/ - Screen Routes

Expo Router uses file-based routing. Each `.tsx` file becomes a route.

#### Root Layout & Entry

| File | Route | Purpose |
|------|-------|---------|
| `_layout.tsx` | - | **Root layout**: Loads fonts (Chunko-Bold, Poppins), initializes auth store, shows splash screen, defines Stack navigator with all route groups |
| `index.tsx` | `/` | **Entry point**: Determines navigation route based on auth state. Redirects to landing (unauthenticated), onboarding (new user), questionnaire (incomplete questionnaire), or home (complete user) |
| `+not-found.tsx` | `/*` | 404 fallback screen |

#### (auth)/ - Authentication Flow

| File | Route | Purpose |
|------|-------|---------|
| `_layout.tsx` | - | Stack navigator for auth screens |
| `landing.tsx` | `/(auth)/landing` | **Landing page**: Displays Santelle logo, "Welcome to Santelle", Email sign-in button, Apple sign-in button. Handles Apple auth success and redirects appropriately |
| `email.tsx` | `/(auth)/email` | **Email entry**: Text input for email address, validates format, calls `requestEmailOtp()` to send verification code, navigates to OTP screen |
| `otp.tsx` | `/(auth)/otp` | **OTP verification**: 6-digit code input, verifies with `verifyEmailOtp()`, creates questionnaire entry if new user, navigates to appropriate next step |

#### (onboarding)/ - User Onboarding Flow

| File | Route | Purpose |
|------|-------|---------|
| `_layout.tsx` | - | Stack navigator with slide animation |
| `name.tsx` | `/(onboarding)/name` | **Display name entry**: Collects user's preferred display name, creates/updates `onboarding_responses` table entry |
| `year.tsx` | `/(onboarding)/year` | **Birth year selection**: Native picker for birth year (ages 16-100), saves to `date_of_birth` field |
| `country.tsx` | `/(onboarding)/country` | **Country selection**: Searchable dropdown with ~200 countries, marks `onboarding_complete: true`, navigates to questionnaire |

#### (questionnaire)/ - Health Questionnaire Flow

7 screens collecting user health context for personalization. Each saves answers to `questionnaire` table columns (q1-q7).

| File | Route | Question | Answer Type |
|------|-------|----------|-------------|
| `motivation.tsx` | `/(questionnaire)/motivation` | "What made you curious about Santelle?" | Multi-select (prevention, fertility, stigma, complement, understanding) |
| `test-frequency.tsx` | `/(questionnaire)/test-frequency` | Testing frequency preferences | Single select |
| `reaction-to-discomfort.tsx` | `/(questionnaire)/reaction-to-discomfort` | How user reacts to vaginal discomfort | Single select |
| `confidence-level.tsx` | `/(questionnaire)/confidence-level` | Confidence in understanding vaginal health | Single select |
| `infection-frequency.tsx` | `/(questionnaire)/infection-frequency` | History of vaginal infections | Single select |
| `gynecologist-satisfaction.tsx` | `/(questionnaire)/gynecologist-satisfaction` | Satisfaction with gynecologist visits | Single select |
| `emotional-reaction.tsx` | `/(questionnaire)/emotional-reaction` | Emotional response to vaginal issues | Single select, marks `questionnaire_complete: true` |

Each screen features:
- Back button (except first screen)
- Skip button
- Animated selection options with emojis
- Continue button that saves to database

#### (tabs)/ - Main App Tabs

| File | Route | Purpose |
|------|-------|---------|
| `_layout.tsx` | - | Tab navigator using `CustomDockNavbar` component (floating pill-style bottom nav) |
| `home.tsx` | `/(tabs)/home` | **Dashboard**: WelcomeCard (greeting, days since last test, health summary), latest test result modal, article cards about biomarkers, pull-to-refresh |
| `tests.tsx` | `/(tabs)/tests` | **Test management**: Shows CurrentTest component (if active session) or StartTest component, test history grid with animated cards, tap to view test details |
| `insights.tsx` | `/(tabs)/insights` | **Coming Soon** placeholder for future health insights/analytics |
| `education.tsx` | `/(tabs)/education` | **Learning content**: Fetches articles from `articles` table, displays in cards, full article modal with markdown rendering |

#### log-test/ - Test Execution Flow

| File | Route | Purpose |
|------|-------|---------|
| `_layout.tsx` | - | Stack navigator for test flow |
| `questionnaire.tsx` | `/log-test/questionnaire` | **Pre-test questions**: "Are you on your period?" and "Had sex in last 24 hours?" If yes to either, shows warning modal about result accuracy. Starts test session if validated |
| `test.tsx` | `/log-test/test` | **7-step test wizard**: Horizontal swipeable FlatList with step cards. Includes: (1) Sample collection, (2) Solution prep, (3) Add to wells + start timer, (4) Add reagent, (5) pH results with timer, (6) NAG stop + wait timer, (7) Final result logging. Manages timers, validates pH selection before step 7, schedules notification when results ready |

---

### apps/src/ - Source Code

#### src/components/

##### animations/
| File | Purpose |
|------|---------|
| `LottieRefreshIcon.tsx` | Lottie animation component for pull-to-refresh indicator |
| `ShrinkableTouchable.tsx` | TouchableOpacity wrapper that scales down on press with spring animation |

##### buttons/
| File | Purpose |
|------|---------|
| `AppleSignInButton.tsx` | Apple Sign-In button using `expo-apple-authentication`. Handles nonce generation, credential validation, calls `signInWithApple()` API |
| `EmailSignInButton.tsx` | Styled button with mail icon for email sign-in navigation |

##### home/
| File | Purpose |
|------|---------|
| `welcome-card.tsx` | **Main dashboard card**: Animated drop-in notification style. Shows greeting with display name, days since last test, health summary. Buttons for "View Latest Test", "Activate Kit"/"Resume Test". Contains AccountModal trigger |
| `article-card.tsx` | Glassmorphic card component for educational article previews with image, title, description |

##### icons/
| File | Purpose |
|------|---------|
| `CustomIcon.tsx` | Wrapper component that renders icons from registry by name, size, color |
| `IconRegistry.tsx` | Maps icon names to SVG components: `home`, `history`, `analytics`, `log-test`, `person`, `s-logo`, `x` |
| `index.ts` | Barrel export for icons module |
| `types.ts` | TypeScript types for icon props |
| `svg/` | Individual SVG icon components: `AnalyticsIcon`, `AppleIcon`, `ArrowLeftIcon`, `GoogleIcon`, `HistoryIcon`, `HomeIcon`, `LogoCrossIcon`, `LogTestIcon`, `MailIcon`, `PersonIcon`, `SLogoIcon`, `UserIcon`, `XIcon` |

##### layout/
| File | Purpose |
|------|---------|
| `ScreenBackground.tsx` | **Universal screen wrapper**: ImageBackground with `background-mobile.jpg`, BlurView overlay (intensity 50), provides consistent app aesthetic |

##### modals/
| File | Purpose |
|------|---------|
| `account-modal.tsx` | Account settings modal: displays user email, sign-out button, app version |
| `article-modal.tsx` | Full-screen article reader: hero image, title, author, date, category, markdown content rendering |
| `test-result.tsx` | **Test log detail modal**: Shows all 6 biomarkers with color-coded status indicators (green/amber/red), AI analysis text, loading state while analysis generates |
| `test-warning.tsx` | Warning dialog for pre-test questionnaire: explains why period/recent sex affects results, "Go Back" and "Continue Anyway" options |
| `biomarker-utils.ts` | **Biomarker interpretation logic**: Functions `getPHStatus()`, `getPHDetail()`, `getBiomarkerStatus()`, `getBiomarkerDescription()` - returns colors (green/amber/red/grey), tags, and detailed explanations for each biomarker value combination |

##### steps/ (Test wizard components)
| File | Purpose |
|------|---------|
| `step-card.tsx` | Generic instruction card with image, title, bullet points (supports markdown bold) |
| `pH-result-selector.tsx` | pH selection UI: 4 pill buttons (3.8-4.4, 4.6, 4.8, 5.4), saves selection to test_logs |
| `pH-timer-card.tsx` | 1-minute countdown timer card for pH reading, "Skip" button option |
| `result-selector.tsx` | Final results selector: 5 biomarker rows (H₂O₂, LE, SNA, β-G, NAG) with three-way toggle (-, ±, +), submits results and triggers AI analysis |
| `test-timer-card.tsx` | 10-minute countdown timer card for final results, "Skip" button option |
| `small-timer-card.tsx` | Compact timer display shown above step cards during countdown |

##### tests/ (Tests tab components)
| File | Purpose |
|------|---------|
| `current-test.tsx` | Active test session card: step X of 7 progress, time remaining, "Resume" button |
| `start-test.tsx` | Card prompting user to start new test session |
| `compact-test.tsx` | Grid item showing test date, time, all 6 biomarker values with color coding |
| `progress-card.tsx` | Test wizard header: step dots indicator, cancel button |

##### Other
| File | Purpose |
|------|---------|
| `dock.tsx` | **Custom bottom navigation**: Floating pill-style navbar with blur background, animated sliding indicator, haptic feedback. 4 tabs: Home, Tests, Learn, Insights |
| `SplashScreen.tsx` | Splash screen component shown during app initialization |

---

#### src/features/

##### auth/
| File | Purpose |
|------|---------|
| `auth.api.ts` | **Supabase auth functions**: `requestEmailOtp()`, `verifyEmailOtp()`, `signInWithApple()`, `signOut()`, `getSession()`, `getUser()`, `needsOnboarding()`, `needsQuestionnaire()`, `getUserNavigationRoute()`, onboarding CRUD (`createOnboardingResponse()`, `updateOnboardingResponse()`, `getOnboardingResponse()`), questionnaire CRUD (`createQuestionnaireEntry()`, `saveQuestionnaireAnswer()`, `markQuestionnaireComplete()`) |
| `auth.store.ts` | **Zustand auth store**: Persisted to AsyncStorage. State: `user`, `session`, `loading`, `isAuthenticated`, OTP/Apple loading states. Actions: `initialize()`, `requestEmailOtp()`, `verifyEmailOtp()`, `signInWithApple()`, `signOut()`, `refreshSession()`. Exports hooks: `useAuth()`, `useEmailAuth()`, `useAppleAuth()` |
| `useSession.ts` | Simple hook returning `{ session, loading }` from auth store |

##### test-session/
| File | Purpose |
|------|---------|
| `testSession.api.ts` | **Test session CRUD**: Types `TestSession`, `TestResults`. Functions: `fetchOpenSession()`, `createSession()`, `setStep()`, `setPhResultsReadyAt()`, `setResultsReadyAt()`, `completeSession()`, `abortSession()`, `upsertResults()` |
| `testSession.store.ts` | **Zustand test session store**: Persisted to AsyncStorage. State: `session` (id, current_step, status, timer timestamps), `loading`, `error`. Actions: `hydrateFromServer()`, `startSession()`, `setStep()`, `setResultsReadyAt()`, `setPhResultsReadyAt()`, `complete()`, `abort()`, `upsertResults()`, `resetLocal()`. Uses optimistic updates with rollback |
| `sessionHydrator.tsx` | Component that hydrates test session from server on mount (used in root layout) |

##### test-logs/
| File | Purpose |
|------|---------|
| `testLogs.api.ts` | **Test log CRUD**: Type `TestLog`. Functions: `ensureLog()`, `getLogBySession()`, `upsertLogResultsFlat()`, `upsertFinalResultsFromUI()` (maps UI labels to DB columns), `fetchLatestTestLog()`, `analyzeLog()` (invokes edge function), `fetchLogById()` |
| `welcomeCopy.ts` | Helper function `buildWelcomeCopy()` for generating personalized dashboard messages |

##### articles/
| File | Purpose |
|------|---------|
| `articles.api.ts` | `listArticles()` - fetches published articles from `articles` table |
| `useArticles.ts` | React hook for articles data fetching |

---

#### src/services/

| File | Purpose |
|------|---------|
| `supabase.ts` | **Supabase client initialization**: Creates client with URL and anon key from environment variables, configures auth persistence with AsyncStorage |
| `analyze-results.ts` | Client-side function to invoke `analyze-results` edge function with user JWT |
| `notifications.ts` | **Push notifications**: `ensureNotifPermission()`, `scheduleResultsReady()` (schedules notification for when results timer completes), `cancelNotification()` |
| `devAuth.ts` | Development-only auto sign-in helper (uses env vars `EXPO_PUBLIC_DEV_EMAIL`, `EXPO_PUBLIC_DEV_PASSWORD`) |
| `log.ts` | Logging utilities |

---

#### src/theme/

| File | Purpose |
|------|---------|
| `colors.tsx` | **Color palette**: Light/dark mode colors. Brand colors: `pearl` (#FABDD7), `flow` (#FD9EAA), `blush` (#EF7D88), `rush` (#721422 - primary), `dune` (#FFEBCE). Also text, background, surface, border colors |
| `fonts.tsx` | Font configuration (currently empty, fonts loaded in root layout) |

---

### supabase/ - Backend Functions

#### config.toml

Configures the `analyze-results` edge function:
- JWT verification enabled
- Custom import map for Deno dependencies
- Entry point: `./functions/analyze-results/index.ts`

#### functions/analyze-results/

| File | Purpose |
|------|---------|
| `deno.json` | Deno import map: `openai` (npm:openai@4.97.0), `supabase` (@supabase/supabase-js@2.49.4) |
| `index.ts` | **AI Analysis Edge Function**: POST endpoint that takes `test_log_id`, loads test results from DB, builds detailed prompt with manufacturer's official interpretation text, calls OpenAI GPT-4o-mini to generate friendly health summary, saves analysis back to `test_logs.analysis` column. Includes full biomarker interpretation guide from test kit manufacturer |

---

## User Flow

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│   Landing   │────▶│  Email/OTP   │────▶│  Onboarding   │────▶│ Questionnaire  │
│   Screen    │     │   or Apple   │     │  (3 screens)  │     │  (7 screens)   │
└─────────────┘     └──────────────┘     └───────────────┘     └────────────────┘
                                                                        │
                                                                        ▼
                                                               ┌────────────────┐
                                                               │   Home Tab     │
                                                               │  (Dashboard)   │
                                                               └────────────────┘
                                                                        │
                          ┌──────────────────────────────────────────────┼──────────────────────────────────────────────┐
                          │                                              │                                              │
                          ▼                                              ▼                                              ▼
                 ┌────────────────┐                             ┌────────────────┐                             ┌────────────────┐
                 │   Tests Tab    │                             │   Learn Tab    │                             │  Insights Tab  │
                 │   (History)    │                             │  (Education)   │                             │ (Coming Soon)  │
                 └────────────────┘                             └────────────────┘                             └────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  Activate Kit  │
                 │ Pre-Questions  │
                 └────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  7-Step Test   │
                 │    Wizard      │
                 └────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │   AI Analysis  │
                 │   (Edge Fn)    │
                 └────────────────┘
```

---

## Database Tables

Based on the codebase, the following Supabase tables are used:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `onboarding_responses` | User profile data | `user_id`, `display_name`, `email`, `date_of_birth`, `country`, `onboarding_complete`, `completed_at` |
| `questionnaire` | Health questionnaire answers | `user_id`, `q1` (array), `q2`-`q7` (integers), `questionnaire_complete` |
| `test_sessions` | Active/completed test sessions | `id`, `user_id`, `status` (in_progress/completed/aborted), `current_step`, `started_at`, `results_ready_at`, `ph_result_ready_at`, `completed_at` |
| `test_logs` | Test results and analysis | `id`, `user_id`, `test_session_id`, `ph`, `h2o2`, `le`, `sna`, `beta_g`, `nag`, `analysis`, `status`, `created_at` |
| `articles` | Educational content | `id`, `title`, `subtitle`, `content_md`, `hero_image_url`, `author`, `published_at`, `category` |

---

## Environment Variables

Required environment variables (prefix `EXPO_PUBLIC_` for client access):

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Service role key (edge functions only) |
| `OPENAI_API_KEY` | OpenAI API key (edge functions only) |
| `EXPO_PUBLIC_DEV_EMAIL` | (Dev only) Auto sign-in email |
| `EXPO_PUBLIC_DEV_PASSWORD` | (Dev only) Auto sign-in password |

---

>>>>>>> Stashed changes
## Development Setup

### Prerequisites

<<<<<<< Updated upstream
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
=======
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- Supabase CLI (for local development)

### Installation

```bash
# Clone repository
cd santelle-redesign

# Install dependencies
cd apps
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### Supabase Local Development

```bash
# Start Supabase locally
supabase start

# Deploy edge functions
supabase functions deploy analyze-results

# Test edge function
curl -X POST 'http://127.0.0.1:54321/functions/v1/analyze-results' \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"test_log_id": "<uuid>"}'
```

---

## Deployment

### Mobile Apps (EAS Build)

```bash
# Build for iOS TestFlight
>>>>>>> Stashed changes
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
<<<<<<< Updated upstream
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
=======

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

### Supabase Edge Functions

```bash
# Deploy to production
supabase functions deploy analyze-results --project-ref <project-id>
```

---

## Key Design Patterns

1. **Feature-based architecture**: Code organized by feature (auth, test-session, articles) rather than type
2. **Zustand stores with persistence**: Auth and test session state persisted to AsyncStorage
3. **Optimistic updates**: UI updates immediately, rolls back on server error
4. **File-based routing**: Expo Router maps files to routes automatically
5. **Glassmorphism UI**: Consistent use of BlurView + transparency throughout
6. **Animated microinteractions**: Spring animations, haptic feedback on all interactions
7. **Type safety**: Full TypeScript with strict types for API responses

---
>>>>>>> Stashed changes

## License

Private project - All rights reserved

---

For questions or issues, please contact the development team or create an issue in the repository.
