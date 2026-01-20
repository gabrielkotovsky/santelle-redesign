# Santelle - Women's Health Testing App

A React Native mobile application built with Expo for at-home vaginal health biomarker testing and tracking.

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Analysis**: OpenAI GPT via Supabase Edge Functions

---

## Repository Structure

```
santelle-redesign/
├── apps/                        # Main application
│   ├── app/                     # Screens (Expo Router file-based routing)
│   │   ├── (auth)/              # Auth screens: landing, email, otp
│   │   ├── (onboarding)/        # Onboarding: name, year, country
│   │   ├── (questionnaire)/     # 7 health questionnaire screens
│   │   ├── (tabs)/              # Main tabs: home, tests, insights, education
│   │   └── log-test/            # Test execution flow
│   │
│   ├── src/
│   │   ├── components/          # UI components
│   │   │   ├── animations/      # Lottie, touch animations
│   │   │   ├── buttons/         # Sign-in buttons
│   │   │   ├── home/            # Dashboard components
│   │   │   ├── icons/           # SVG icon system
│   │   │   ├── layout/          # Screen wrappers
│   │   │   ├── modals/          # Modal dialogs
│   │   │   ├── steps/           # Test wizard step cards
│   │   │   └── tests/           # Test history components
│   │   │
│   │   ├── features/            # Feature modules
│   │   │   ├── auth/            # Authentication (store, API, hooks)
│   │   │   ├── articles/        # Educational content
│   │   │   ├── test-logs/       # Test results history
│   │   │   └── test-session/    # Active test session management
│   │   │
│   │   ├── services/            # External integrations
│   │   │   ├── supabase.ts      # Supabase client
│   │   │   ├── notifications.ts # Push notifications
│   │   │   └── analyze-results.ts
│   │   │
│   │   └── theme/               # Colors & fonts
│   │
│   ├── assets/                  # Static files
│   │   ├── animations/          # Lottie JSON
│   │   ├── fonts/               # Chunko-Bold, Poppins
│   │   ├── icons/               # SVG sources
│   │   └── images/              # App images
│   │
│   ├── app.json                 # Expo config
│   ├── eas.json                 # EAS Build config
│   └── package.json             # Dependencies
│
└── supabase/
    └── functions/
        └── analyze-results/     # AI analysis edge function
```

---

## Quick Start

```bash
cd apps
npm install
npm start
```

---

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## License

Private project - All rights reserved
