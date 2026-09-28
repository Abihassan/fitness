<div align="center">

# 💪 MAKSH

### Your Personal Fitness. Your Progress. Your Journey.

<p>
  <img src="https://img.shields.io/badge/React_Native-0.81+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-SDK_56-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Navigation-Enabled-6B52AE?style=for-the-badge&logo=react&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Architecture-Local--First-00C853?style=flat-square" />
  <img src="https://img.shields.io/badge/Storage-AsyncStorage%20%7C%20SecureStore-FF9800?style=flat-square" />
  <img src="https://img.shields.io/badge/Backend-Ready%20for%20Future-795548?style=flat-square" />
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-exercise-system">Exercises</a> •
  <a href="#-workout-system">Workouts</a> •
  <a href="#-analytics--progress">Analytics</a> •
  <a href="#-setup">Setup</a>
</p>

</div>

---

## 🧬 What is MAKSH?

**MAKSH** is a local-first fitness and workout tracking application built with **React Native, Expo, TypeScript, and React Navigation**.

The application combines:

* 🏋️ Exercise discovery
* 📋 Workout routine creation
* ⏱️ Active workout tracking
* 📈 Progress monitoring
* 🏆 Missions and achievements
* 🧠 Personalization
* ❤️ Exercise favorites
* 💪 Muscle-group visualization
* 📊 Workout analytics
* 💾 Persistent local data

The application is designed around a **local-first architecture**, meaning the core fitness experience does not depend on a backend server.

> **Train smarter. Track progress. Build consistency.**

---

# ✨ Features

<table>
<tr>
<td width="50%">

### 🏋️ Exercise Library

Explore exercises across multiple disciplines:

* Strength
* Cardio
* HIIT
* Calisthenics
* Mobility
* Yoga
* Pilates
* Stretching
* Balance
* Beginner
* Other supported categories

</td>

<td width="50%">

### 📋 Workout Builder

Create and manage personalized routines.

* Exercise selection
* Routine templates
* Drag-to-reorder
* Set configuration
* Active workouts
* Set logging
* Workout history
* Volume calculation

</td>
</tr>

<tr>
<td>

### 📊 Progress Tracking

Understand your training over time.

* Workout history
* Volume tracking
* Personal records
* Progress analytics
* Calendar-based history
* Training insights
* Muscle activity visualization

</td>

<td>

### 🏆 Missions & Achievements

Stay consistent and track milestones.

* Missions
* Achievements
* Progress evaluation
* Training milestones
* Achievement engine

</td>
</tr>

<tr>
<td>

### 🧠 Personalization

MAKSH uses your onboarding information to personalize the fitness experience.

* Personalization profile
* Training preferences
* Persisted onboarding answers
* Personalized workout path

</td>

<td>

### ❤️ Favorites

Save exercises that you frequently use.

* Favorite exercises
* Persistent favorite state
* Quick exercise access

</td>
</tr>
</table>

---

# 🎬 Application Flow

```text
                         ┌───────────────────┐
                         │       MAKSH       │
                         │   Fitness App     │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Splash       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     Welcome       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Explore      │
                         │   5-slide flow    │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Personalization │
                         └─────────┬─────────┘
                                   │
                                   ▼
                 ┌─────────────────────────────────┐
                 │             MAKSH                │
                 ├──────────┬──────────┬───────────┤
                 │   Home   │ Missions │  Progress │
                 └──────────┴──────────┴───────────┘
                                   │
                                   ▼
                              Profile
```

---

# 🏗️ Architecture

MAKSH is structured around a **local-first application architecture**.

```text
┌─────────────────────────────────────────────────────┐
│                     MAKSH APP                       │
│                 React Native + Expo                 │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                    Navigation                       │
│                React Navigation                     │
└───────────────────────┬─────────────────────────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   ┌─────────┐    ┌───────────┐    ┌───────────┐
   │  Home   │    │  Workout  │    │ Progress  │
   └─────────┘    └───────────┘    └───────────┘
        │               │                │
        └───────────────┼────────────────┘
                        ▼
              ┌─────────────────────┐
              │   AppDataProvider   │
              └──────────┬──────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  DataService  │
                 └───────┬───────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ localDataService    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ AsyncStorage        │
              │ SecureStore         │
              └─────────────────────┘
```

### 🔌 Future Backend Seam

The application intentionally separates data access from UI logic.

```text
                 DataService
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
 localDataService        remoteDataService
     CURRENT                 FUTURE
          │                     │
          ▼                     ▼
   AsyncStorage          FastAPI Backend
   SecureStore           PostgreSQL
```

This means a future remote backend can be introduced without rebuilding the application's core screens and workout logic.

---

# 🧩 Exercise System

The original exercise experience was consolidated into a reusable system rather than maintaining many separate category-specific screens.

### Exercise navigation

```text
Category
   │
   ▼
Category Detail
   │
   ▼
Exercise Detail
   │
   ▼
Workout / Favorite
```

The application uses a shared exercise library and reusable filtering logic.

### 🔎 Exercise discovery

```text
Discipline
    │
    ▼
Category Filter
    │
    ▼
Exercise List
    │
    ▼
Exercise Detail
    │
    ├──────────────► Favorite
    │
    └──────────────► Add to Routine
```

---

# 🏋️ Workout System

MAKSH includes a complete workout-building and tracking flow.

```text
Choose Exercises
       │
       ▼
Create Routine
       │
       ▼
Reorder Exercises
       │
       ▼
Configure Sets
       │
       ▼
Start Workout
       │
       ▼
Log Sets
       │
       ▼
Calculate Volume
       │
       ▼
Detect PRs
       │
       ▼
Save Workout
       │
       ▼
Update Progress
```

### Workout capabilities

* Custom routines
* Routine templates
* Exercise selection
* Drag-to-reorder
* Active workout mode
* Set logging
* Workout volume
* Personal records
* Workout history

---

# 📈 Progress & Analytics

MAKSH is not only an exercise browser.

The application is designed to turn workout activity into meaningful progress information.

### Tracking pipeline

```text
Workout
   │
   ├── Sets
   ├── Reps
   ├── Weight
   └── Exercises
        │
        ▼
   Workout Record
        │
        ├─────────────► Volume
        │
        ├─────────────► PR Detection
        │
        ├─────────────► History
        │
        ├─────────────► Achievements
        │
        └─────────────► Insights
```

### 📊 Progress includes

* Workout history
* Volume calculations
* PR tracking
* Training calendar
* Progress insights
* Muscle activity
* Achievement progress

---

# 💪 Muscle Visualization

MAKSH includes a visual representation of muscle activity.

The application uses a custom SVG-based muscle map to represent training activity across muscle groups.

```text
                 ┌─────────────┐
                 │   Workout   │
                 └──────┬──────┘
                        │
                        ▼
                Exercises Logged
                        │
                        ▼
                  Muscle Groups
                        │
                        ▼
               ┌────────────────┐
               │  Muscle Map    │
               │     SVG        │
               └────────────────┘
```

This provides a visual connection between:

**Exercise → Muscle Group → Training Activity → Progress**

---

# 🏆 Missions & Achievements

MAKSH separates daily training activity from achievement tracking.

The achievement engine evaluates workout-related activity and determines when milestones have been reached.

```text
Workout Activity
       │
       ▼
Achievement Engine
       │
       ├──► Mission Progress
       │
       ├──► Achievement Progress
       │
       └──► Milestone
```

---

# ❤️ Favorites

Exercises can be saved for quick access.

```text
Exercise
   │
   ▼
❤️ Favorite
   │
   ▼
favoriteExerciseIds
   │
   ▼
Persistent Local State
```

Favorite state is managed through the application's shared data layer rather than directly manipulating storage from individual screens.

---

# 🧠 Personalization

MAKSH starts by understanding the user's fitness preferences.

```text
Splash
  ↓
Welcome
  ↓
Explore
  ↓
Personalization
  ↓
Profile
  ↓
Fitness Experience
```

Personalization information is persisted locally and becomes part of the application's shared state.

---

# 🎨 UI / Design

MAKSH follows a dedicated fitness-oriented visual system.

### Design characteristics

* 🌑 Dark-focused interface
* 🎨 Centralized color tokens
* 🧩 Reusable components
* 📱 Mobile-first layouts
* 📊 Custom SVG charts
* 💪 Muscle visualization
* 🎞️ Profile animations
* ♿ Accessibility considerations
* 🧭 Consistent navigation

---

# 🛠️ Tech Stack

<div align="center">

### 📱 Mobile

<img src="https://skillicons.dev/icons?i=react,typescript,expo,android" />

### ⚙️ Application

<img src="https://skillicons.dev/icons?i=react,typescript" />

### 💾 Storage

<img src="https://skillicons.dev/icons?i=sqlite" />

### 🔮 Future Backend

<img src="https://skillicons.dev/icons?i=fastapi,postgres,docker" />

</div>

### Core technologies

| Layer                | Technology          |
| -------------------- | ------------------- |
| Mobile               | React Native        |
| Framework            | Expo                |
| Language             | TypeScript          |
| Navigation           | React Navigation    |
| Local Storage        | AsyncStorage        |
| Secure Storage       | SecureStore         |
| Visualization        | SVG / Custom Charts |
| Current Architecture | Local-first         |
| Future Backend       | FastAPI             |
| Future Database      | PostgreSQL          |

---

# 📁 Project Structure

```text
maksh/
│
├── frontend/
│   │
│   ├── App.tsx
│   │
│   ├── src/
│   │   │
│   │   ├── navigation/
│   │   │
│   │   ├── screens/
│   │   │   ├── Splash/
│   │   │   ├── Welcome/
│   │   │   ├── Explore/
│   │   │   ├── PersonalizePath/
│   │   │   ├── RoutineEditor/
│   │   │   ├── ActiveWorkout/
│   │   │   └── ExercisePicker/
│   │   │
│   │   ├── tabs/
│   │   │   ├── Home/
│   │   │   ├── Missions/
│   │   │   ├── Progress/
│   │   │   └── Profile/
│   │   │
│   │   ├── exercise/
│   │   │   ├── CategoryGrid/
│   │   │   ├── CategoryDetail/
│   │   │   ├── ExerciseDetail/
│   │   │   └── ChallengeDetail/
│   │   │
│   │   ├── components/
│   │   │   ├── MuscleMap/
│   │   │   ├── Charts/
│   │   │   ├── Cards/
│   │   │   └── Buttons/
│   │   │
│   │   ├── context/
│   │   │   ├── AppDataProvider/
│   │   │   └── PendingSelectionContext/
│   │   │
│   │   ├── services/
│   │   │   ├── DataService/
│   │   │   └── localDataService/
│   │   │
│   │   ├── storage/
│   │   │
│   │   ├── data/
│   │   │   ├── exercises/
│   │   │   ├── categories/
│   │   │   ├── achievements/
│   │   │   ├── routineTemplates/
│   │   │   ├── challenges/
│   │   │   ├── muscles/
│   │   │   └── warmups/
│   │   │
│   │   ├── utils/
│   │   │   ├── dateUtils/
│   │   │   ├── prCalc/
│   │   │   ├── volumeCalc/
│   │   │   └── achievementEngine/
│   │   │
│   │   ├── theme/
│   │   └── types/
│   │
│   └── assets/
│
└── backend/
    ├── FastAPI
    └── PostgreSQL
```

> The backend directory represents the future backend seam and is **not currently required to run the core application**.

---

# 💾 Local-First Architecture

One of the core design decisions behind MAKSH is keeping the fitness experience functional without requiring a remote server.

### Current

```text
             MAKSH
               │
               ▼
          AppDataProvider
               │
               ▼
          DataService
               │
               ▼
      localDataService
               │
        ┌──────┴──────┐
        ▼             ▼
 AsyncStorage    SecureStore
```

### Future

```text
             MAKSH
               │
               ▼
          AppDataProvider
               │
               ▼
          DataService
               │
        ┌──────┴──────────┐
        ▼                 ▼
 localDataService   remoteDataService
        │                 │
        ▼                 ▼
 Local Storage       FastAPI
                          │
                          ▼
                     PostgreSQL
```

This separation keeps storage concerns away from individual UI screens.

---

# 🔄 What Changed During the MAKSH Build

MAKSH combines the strongest parts of two application implementations into one unified fitness application.

### From the original gym application

* React Navigation structure
* Splash → Welcome → Explore onboarding
* Five-slide Explore carousel
* Personalization flow
* Original icons and illustrations
* Profile animations
* Accessibility improvements

### From the fitness application

* Workout routines
* Set logging
* PR tracking
* Achievement evaluation
* Muscle heatmap
* Progress analytics
* Custom SVG charts
* Fitness-focused dark theme
* Exercise data model
* Utility calculations

### Consolidated

The original exercise navigation was reduced from many category-specific screens into reusable screens driven by shared exercise data and filtering.

```text
Before
────────────────────────────

Many Category Screens
        │
        ├── Strength
        ├── Cardio
        ├── HIIT
        ├── Core
        ├── Mobility
        └── ...
        
        
After
────────────────────────────

Shared Exercise System
        │
        ├── CategoryGrid
        ├── CategoryDetail
        ├── ExerciseDetail
        └── CategoryFilter
```

---

# 🧩 Engineering Principles

MAKSH is being developed around a few core principles:

### 01 — Local First

The core fitness experience should work without a backend dependency.

### 02 — Reusable Architecture

Shared components and services should be preferred over duplicated screens.

### 03 — Data Driven

Exercise and workout experiences should be driven by structured data rather than hardcoded screens.

### 04 — Separation of Concerns

UI, state, storage, calculations, and data access should remain separated.

### 05 — Backend Ready

The application should be capable of introducing remote synchronization later without requiring a complete rewrite.

---

# 🚀 Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abihassan/MAKSH.git
cd MAKSH/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Type-check the project

```bash
npx tsc --noEmit
```

### 4. Run Android

```bash
npx expo run:android
```

### 5. Run iOS

```bash
npx expo run:ios
```

> MAKSH currently uses a local development build. Expo Go is not the target workflow for the current SDK configuration.

---

# ✅ Current Status

| Area                     | Status |
| ------------------------ | :----: |
| React Native application |    ✅   |
| Expo configuration       |    ✅   |
| React Navigation         |    ✅   |
| Onboarding               |    ✅   |
| Personalization          |    ✅   |
| Exercise library         |    ✅   |
| Exercise filtering       |    ✅   |
| Routine builder          |    ✅   |
| Active workout           |    ✅   |
| Set logging              |    ✅   |
| PR tracking              |    ✅   |
| Achievement engine       |    ✅   |
| Muscle visualization     |    ✅   |
| Progress screens         |    ✅   |
| Local data service       |    ✅   |
| Persistent local storage |    ✅   |
| Future backend seam      |   🟡   |
| Remote synchronization   |   🔮   |

---

# ⚠️ Current Limitations

MAKSH is actively evolving.

Current known limitations include:

* Some non-strength disciplines currently contain a smaller exercise collection.
* `ExercisePicker` currently uses `ScrollView` rather than `FlashList`.
* Some muscle-group image assets exist but the active visualization uses the SVG muscle map.
* The FastAPI/PostgreSQL backend is not currently connected to the application.
* Remote synchronization is planned rather than implemented.

---

# 🔮 Future Roadmap

```text
                         MAKSH
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
       More Exercises   Better Stats   More Missions
            │              │              │
            ▼              ▼              ▼
       Richer Library   Advanced PRs   Achievement System
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    Remote Data Layer
                           │
                           ▼
                  FastAPI + PostgreSQL
                           │
                           ▼
                     Cloud Sync
```

Planned directions include:

* 📚 Larger exercise library
* 📊 More advanced analytics
* 🏆 Expanded achievement system
* 🎯 More missions and challenges
* ⚡ Optimized large exercise lists
* ☁️ Optional remote synchronization
* 🔐 Account-based cloud data
* 📱 Continued mobile UX improvements

---

# 📊 Development Snapshot

<div align="center">

### Built around three pillars

|    🏋️ TRAIN    | 📊 TRACK |  🏆 IMPROVE  |
| :-------------: | :------: | :----------: |
|    Exercises    | Workouts |      PRs     |
|     Routines    |   Sets   | Achievements |
| Active Sessions |  Volume  |   Insights   |
|     Training    |  History |  Consistency |

</div>

---

# 🎯 Project Goal

MAKSH is being built around a simple idea:

> **Fitness tracking should feel like a complete product, not just a collection of exercise screens.**

The application brings together:

**Exercise Discovery**

↓

**Personalized Training**

↓

**Routine Building**

↓

**Workout Tracking**

↓

**Progress Analysis**

↓

**Achievements**

↓

**Long-Term Consistency**

---

# 🧑‍💻 Built With

<div align="center">

<img src="https://skillicons.dev/icons?i=react,typescript,expo,android,fastapi,postgres,docker,git,github" />

</div>

---

# 📌 Project Structure at a Glance

```text
                         ┌─────────────┐
                         │    MAKSH    │
                         └──────┬──────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        EXERCISES           WORKOUTS           PROGRESS
             │                  │                  │
             ▼                  ▼                  ▼
        Discovery          Routines             History
        Filtering          Sets                 Volume
        Details            Logging              PRs
        Favorites          Active Session       Insights
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                         ACHIEVEMENTS
                                │
                                ▼
                          CONSISTENCY
```

---

# 🌟 MAKSH Philosophy

<div align="center">

### Discover.

### Train.

### Track.

### Improve.

### Repeat.

</div>

---

# 📜 License

This project is currently under active development.

A final open-source license will be added when the project is ready for public release.

---

<div align="center">

## 💪 MAKSH

### Train smarter. Track progress. Build consistency.

<br />

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=footer" />

</div>




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
