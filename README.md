# MAKSH

A merge of two codebases: `gym.zip` (React Navigation shell, onboarding
flow, and a 20-category exercise browser you'd started) as the structural
foundation, with the routine/logging/analytics engine and dark theme from
`fitness.zip` ported in on top — running fully local for now, with a
deliberate seam for the backend you'd started to slot back in later.

## Directory structure

```
maksh/
├── frontend/                  Expo / React Native app (this is the real work)
│   ├── App.tsx                 Providers + fonts + RootNavigator
│   ├── src/
│   │   ├── navigation/          RootNavigator, MainTabs, ExercisesStack, typed param lists
│   │   ├── screens/              Splash, Welcome, Explore, PersonalizePath,
│   │   │                          RoutineEditor, ActiveWorkout, ExercisePicker
│   │   ├── screens/tabs/          Home, Missions, Progress, Profile
│   │   ├── screens/tabs/exercises/ CategoryGrid, CategoryDetail, ExerciseDetail, ChallengeDetail
│   │   ├── context/               AppDataProvider (6 hooks) + PendingSelectionContext
│   │   ├── services/               DataService interface + localDataService — the backend seam
│   │   ├── storage/                 AsyncStorage/SecureStore primitives
│   │   ├── data/                     exercises, categories, achievements, routineTemplates, challenges, muscles, warmups
│   │   ├── components/                MuscleMap, charts, cards, buttons, drag-to-reorder list, etc.
│   │   ├── utils/                      dateUtils, prCalc, volumeCalc, achievementEngine
│   │   ├── theme/                       color tokens
│   │   └── types/                        the whole data model, one file
│   └── assets/                    gym's original icons/illustrations — kept, reused
└── backend/                    FastAPI + Postgres — present, deliberately not wired up (see backend/README.md)
```

## What actually happened in the merge

**Kept from `gym.zip` as the real structure, not just a shell:**
- React Navigation (not expo-router — that's the biggest single reason
  `fitness.zip`'s screens couldn't be copied in directly; every one of them
  got rewritten against `useNavigation()`/`useRoute()` instead of the
  `router`/`useLocalSearchParams` calls expo-router uses)
- The onboarding sequence — Splash → Welcome → Explore → PersonalizePath —
  all three of the content-bearing screens were real, working code (the
  5-slide animated Explore carousel especially), just restyled dark. The
  quiz in PersonalizePath now actually persists its answers instead of
  `console.log`-ing them into the void
- All 18 category icon assets, the muscle-group images, the welcome
  illustrations — reused as-is
- Your real `ProfileScreen` work (the entrance animation, the
  reduce-motion accessibility check) — kept and restyled; the fake
  "Jame Anderrs" social-profile header and six dead `navigation.navigate()`
  calls to screens that didn't exist are gone, replaced with your real
  streak/volume stats and working settings
- The FastAPI backend, `.env`, and the general shape of a future
  multi-user product — present, untouched in terms of ambition, just not
  wired up yet (see `backend/README.md` for exactly how it plugs back in)

**Ported from `fitness.zip` with essentially no logic changes:**
Everything in `src/types`, `src/data`, `src/utils`, `src/theme`, and almost
all of `src/components` — none of it ever imported `expo-router` in the
first place, so it moved over as-is. This is the routine-building,
set-logging, PR-tracking, achievement-evaluating engine; the muscle
heatmap; the custom SVG charts. That's the majority of the app's actual
functionality, and it's identical to what you already had, just running
under a different navigation library.

**Consolidated, not preserved 1:1:** `gym.zip`'s Exercises tab was ~30
files — 18 category screens plus a 4-deep strength sub-navigation
(muscle → variation → exercises → detail), most reading from static,
duplicated data. That's now 4 files (`CategoryGridScreen`,
`CategoryDetailScreen`, `ExerciseDetailScreen`, `ChallengeDetailScreen`)
driven by one shared exercise list and a `CategoryFilter` type — tapping
"Yoga" and tapping "Beginner" hit the same screen with a different filter,
instead of being separately-maintained code. The exercise library itself
grew from `fitness.zip`'s ~75 strength-only entries to also cover cardio,
HIIT, calisthenics, mobility, yoga, pilates, stretching, and balance —
real named exercises, not placeholders, though this is a starter set
(6-10 per discipline) rather than an exhaustive database.

**New, because the merge needed it:**
- `src/services/DataService.ts` — this is "structured to add a backend
  later." `AppDataProvider` no longer touches `AsyncStorage` directly; it
  calls through this interface, which `localDataService.ts` currently
  implements. Building the real backend out later means writing a
  `remoteDataService.ts` against the same interface and flipping one line
  — nothing in `AppDataProvider` or any screen changes.
- `favoriteExerciseIds` and a real `PersonalizationProfile` in the data
  model, so the "Favorites" category and the quiz answers are both real
  state now, not static content or a console.log.
- The Missions/Progress tab split: gym only had room for 5 tabs, so
  `fitness.zip`'s separate Achievements and Insights/History screens
  became "Missions" (renamed, same content) and "Progress" (Insights and
  Calendar combined behind a segmented control), respectively.

**Removed:** `@react-native-firebase/*` and `@react-native-google-signin/*`
from `package.json` — they were installed but never actually called
anywhere in the source (confirmed by grep before removing anything), and
the "Continue with Google" button they'd have backed is gone from
`WelcomeScreen` per the local-only decision. They're not gone from the
*plan* — see `backend/README.md` for exactly where they come back in.

## Setup

```bash
cd frontend
npm install       # package-lock.json pins versions verified against
                   # Expo SDK 56's own bundledNativeModules.json
npx expo run:ios   # or run:android — Expo Go isn't available for SDK 56,
                   # this builds a dev client locally
```

I ran a real `npm install` and `npx tsc --noEmit` against this exact
codebase before handing it over — zero type errors across all 55 source
files. That's not a guarantee it's bug-free once it's actually running on
a device (I can't do that from here), but the whole thing is at least
internally consistent: every import resolves, every prop matches its
type, every navigation call targets a screen that exists.

## Honest gaps, if you keep going

- The 6-10 exercises per non-strength discipline are real but sparse —
  fine for the app to feel complete when browsing, thin if you actually
  want to *train* yoga or pilates through it.
- `ExercisePickerScreen` uses a plain `ScrollView` instead of `FlashList`
  for its results (the original spec called for `FlashList` everywhere) —
  simpler for a modal context, worth revisiting if that list grows a lot.
- Muscle-group illustration images in `assets/strength/` are present but
  currently unused — the app uses the SVG muscle map everywhere instead.
  Fine to ignore, or wire in as category thumbnails later.
