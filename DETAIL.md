<div align="center">

# ⟡ MAKSH

### A local-first fitness system for training, tracking, and progress.

<br>

<p>
  <a href="#-overview">Overview</a> ·
  <a href="#-experience">Experience</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-technology">Technology</a> ·
  <a href="#-roadmap">Roadmap</a>
</p>

<br>

<img src="https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=flat-square&logo=react&logoColor=111827">
<img src="https://img.shields.io/badge/Expo-SDK_56-000020?style=flat-square&logo=expo&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Architecture-Local_First-10B981?style=flat-square">
<img src="https://img.shields.io/badge/Status-Active_Development-F59E0B?style=flat-square">

</div>

<br>

---

# `01` — Overview

**MAKSH** is a fitness and workout tracking application built around one principle:

> **Keep the training experience simple, structured, and useful.**

Instead of treating fitness as only an exercise database, MAKSH connects the entire training cycle:

```text
DISCOVER
   ↓
PERSONALIZE
   ↓
BUILD
   ↓
TRAIN
   ↓
TRACK
   ↓
ANALYZE
   ↓
IMPROVE
```

The current application is **local-first**. Core fitness functionality does not require a remote backend.

The architecture also contains a clean service boundary for introducing remote data synchronization in the future.

---

# `02` — Product Snapshot

<table>
<tr>
<td width="25%" align="center">

### 🏋️

**EXERCISES**

Structured exercise discovery across multiple training disciplines.

</td>

<td width="25%" align="center">

### 🧱

**ROUTINES**

Build, organize, and customize workout routines.

</td>

<td width="25%" align="center">

### 📈

**PROGRESS**

Track volume, PRs, history, and training activity.

</td>

<td width="25%" align="center">

### 🏆

**ACHIEVEMENTS**

Turn consistent training into missions and milestones.

</td>
</tr>
</table>

---

# `03` — The Experience

MAKSH is organized around four major experiences.

```text
┌──────────────────────────────────────────────────────────────┐
│                         MAKSH                                │
├────────────────────┬────────────────────┬───────────────────┤
│                    │                    │                   │
│     DISCOVER       │       TRAIN        │      PROGRESS     │
│                    │                    │                   │
│  Exercise Library  │  Routine Builder   │   Workout History │
│  Categories        │  Active Workout    │   Volume          │
│  Filtering         │  Set Logging       │   Personal Records│
│  Exercise Details  │  Reordering        │   Insights        │
│  Favorites         │  Templates         │   Muscle Activity │
│                    │                    │                   │
└────────────────────┴────────────────────┴───────────────────┘
                             │
                             ▼
                       ┌─────────────┐
                       │   ACHIEVE   │
                       │             │
                       │ Missions    │
                       │ Milestones  │
                       │ Achievements│
                       └─────────────┘
```

---

# `04` — Exercise Ecosystem

MAKSH moves beyond a strength-only exercise browser.

### Training disciplines

| Discipline      | Purpose                              |
| --------------- | ------------------------------------ |
| 🏋️ Strength    | Resistance and weighted training     |
| 🫀 Cardio       | Cardiovascular activity              |
| ⚡ HIIT          | High-intensity interval training     |
| 🤸 Calisthenics | Bodyweight training                  |
| 🧘 Mobility     | Movement and mobility work           |
| 🧘‍♂️ Yoga      | Yoga-based movement                  |
| 🧎 Pilates      | Controlled movement and conditioning |
| 🧘 Stretching   | Flexibility and recovery             |
| ⚖️ Balance      | Balance-oriented training            |
| 🌱 Beginner     | Beginner-friendly exercises          |

The exercise system is data-driven rather than requiring an independent screen implementation for every category.

### Navigation model

```text
                    EXERCISE LIBRARY
                           │
                           ▼
                       CATEGORY
                           │
                           ▼
                    CATEGORY DETAIL
                           │
                           ▼
                    EXERCISE DETAIL
                       ↙         ↘
                 FAVORITE       ROUTINE
```

---

# `05` — Workout Engine

The workout system is built as a continuous training pipeline.

```text
┌──────────────┐
│   EXERCISES  │
└──────┬───────┘
       ↓
┌──────────────┐
│    ROUTINE   │
└──────┬───────┘
       ↓
┌──────────────┐
│   REORDER    │
└──────┬───────┘
       ↓
┌──────────────┐
│ CONFIGURE    │
│ SETS / REPS  │
└──────┬───────┘
       ↓
┌──────────────┐
│    ACTIVE    │
│   WORKOUT    │
└──────┬───────┘
       ↓
┌──────────────┐
│  LOG SETS    │
└──────┬───────┘
       ↓
┌──────────────┐
│    VOLUME    │
└──────┬───────┘
       ↓
┌──────────────┐
│   PR CHECK   │
└──────┬───────┘
       ↓
┌──────────────┐
│    HISTORY   │
└──────────────┘
```

### Workout capabilities

* Custom routines
* Routine templates
* Exercise selection
* Drag-to-reorder
* Active workout sessions
* Set logging
* Volume calculations
* Personal record tracking
* Workout history

---

# `06` — Progress System

The progress layer converts workout activity into persistent training information.

```text
                   WORKOUT DATA
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
       SETS/REPS      WEIGHT       EXERCISES
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                 WORKOUT RECORD
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
       VOLUME          PRs          HISTORY
          │             │              │
          └─────────────┼──────────────┘
                        ↓
                 PROGRESS INSIGHTS
```

The current progress experience is organized around:

* Workout history
* Training volume
* Personal records
* Calendar-based activity
* Training insights
* Muscle activity
* Achievement progress

---

# `07` — Muscle Visualization

MAKSH includes a custom SVG-based muscle visualization layer.

```text
             ┌─────────────────┐
             │     WORKOUT     │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │    EXERCISES    │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │  MUSCLE GROUPS  │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │   SVG MUSCLE    │
             │      MAP        │
             └─────────────────┘
```

This creates a direct relationship between:

**Exercise → Muscle → Training Activity → Visualization**

---

# `08` — Missions & Achievements

Training activity feeds into an achievement system.

```text
                    ACTIVITY
                       │
                       ▼
               ┌───────────────┐
               │  ACHIEVEMENT  │
               │    ENGINE     │
               └───────┬───────┘
                       │
              ┌────────┴────────┐
              ↓                 ↓
          MISSIONS          ACHIEVEMENTS
              │                 │
              └────────┬────────┘
                       ↓
                  MILESTONES
```

This separates the **training system** from the **motivation layer**, allowing missions and achievements to evolve independently.

---

# `09` — Personalization

The first-run experience guides the user through onboarding before entering the main application.

```text
SPLASH
  │
  ▼
WELCOME
  │
  ▼
EXPLORE
  │
  ▼
PERSONALIZE
  │
  ▼
MAIN APPLICATION
```

The personalization profile is persisted locally and made available through the shared application state.

---

# `10` — Favorites

Favorites are handled as application state rather than being directly managed by individual screens.

```text
                    EXERCISE
                       │
                       ▼
                 ❤️ FAVORITE
                       │
                       ▼
             favoriteExerciseIds
                       │
                       ▼
                APP DATA STATE
                       │
                       ▼
              LOCAL PERSISTENCE
```

This keeps favorite behavior consistent across the application.

---

# `11` — Architecture

MAKSH uses a layered architecture designed around separation of concerns.

```text
┌────────────────────────────────────────────────────────────┐
│                         UI LAYER                           │
│                                                            │
│  Home · Missions · Progress · Profile · Exercise Screens │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                       STATE LAYER                          │
│                                                            │
│  AppDataProvider · PendingSelectionContext                │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                          │
│                                                            │
│                      DataService                           │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     DATA LAYER                             │
│                                                            │
│                   localDataService                         │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    LOCAL STORAGE                           │
│                                                            │
│                AsyncStorage · SecureStore                 │
└────────────────────────────────────────────────────────────┘
```

---

# `12` — Local-First by Design

The current MAKSH application does not require a backend for its core experience.

### Current architecture

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
              ↙       ↘
             ↓         ↓
      AsyncStorage   SecureStore
```

### Future architecture

```text
                     MAKSH
                       │
                       ▼
                AppDataProvider
                       │
                       ▼
                  DataService
                  ↙          ↘
                 ↓            ↓
       localDataService   remoteDataService
              │                  │
              ↓                  ↓
       Local Storage       FastAPI Backend
                                  │
                                  ↓
                             PostgreSQL
```

The `DataService` abstraction provides the seam between the application and its storage implementation.

---

# `13` — Project Structure

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
│   │   ├── data/
│   │   ├── utils/
│   │   ├── theme/
│   │   └── types/
│   │
│   └── assets/
│
└── backend/
    ├── FastAPI
    └── PostgreSQL
```

---

# `14` — Technology

<div align="center">

### MOBILE

<img src="https://skillicons.dev/icons?i=react,typescript,expo,android" />

<br><br>

### DATA & STORAGE

<img src="https://skillicons.dev/icons?i=sqlite" />

<br><br>

### FUTURE BACKEND

<img src="https://skillicons.dev/icons?i=fastapi,postgres,docker" />

<br><br>

### DEVELOPMENT

<img src="https://skillicons.dev/icons?i=git,github,vscode" />

</div>

<br>

| Layer                | Technology          |
| -------------------- | ------------------- |
| Mobile               | React Native        |
| Framework            | Expo                |
| Language             | TypeScript          |
| Navigation           | React Navigation    |
| State                | React Context       |
| Local Data           | AsyncStorage        |
| Secure Data          | SecureStore         |
| Visualization        | SVG / Custom Charts |
| Current Architecture | Local-first         |
| Future API           | FastAPI             |
| Future Database      | PostgreSQL          |

---

# `15` — Design System

MAKSH follows a fitness-oriented dark interface with reusable design primitives.

```text
┌──────────────────────────────────────────────┐
│                  MAKSH UI                    │
├──────────────────────────────────────────────┤
│                                              │
│  COLORS       COMPONENTS       VISUALS       │
│                                              │
│  Tokens       Cards            SVG Maps      │
│  Themes       Buttons          Charts        │
│  Surfaces     Lists            Animations    │
│                                              │
└──────────────────────────────────────────────┘
```

The project includes reusable components for:

* Cards
* Buttons
* Charts
* Muscle maps
* Exercise displays
* Workout elements
* Profile elements

---

# `16` — Engineering Principles

### `01` Local First

Core functionality should not depend on network availability.

### `02` Data Driven

Exercise and workout experiences are driven by structured data.

### `03` Reusable

Common behavior belongs in reusable components, services, and utilities.

### `04` Separated

UI, application state, persistence, and calculations remain separated.

### `05` Extensible

The service architecture leaves room for future remote synchronization.

---

# `17` — Validation

The project includes TypeScript validation as part of development.

```bash
cd frontend

npm install

npx tsc --noEmit
```

The current source was type-checked successfully across the project during development.

Device-level behavior still needs to be validated on the intended Android/iOS development environments.

---

# `18` — Getting Started

### Clone

```bash
git clone https://github.com/Abihassan/MAKSH.git
```

### Enter the application

```bash
cd MAKSH/frontend
```

### Install

```bash
npm install
```

### Android

```bash
npx expo run:android
```

### iOS

```bash
npx expo run:ios
```

---

# `19` — Current State

```text
CORE APPLICATION
████████████████████████████████████████

Exercise Library       ████████████████████
Navigation             ████████████████████
Onboarding             ████████████████████
Personalization        ████████████████████
Routine Builder        ████████████████████
Active Workout         ████████████████████
Set Logging            ████████████████████
PR Tracking            ████████████████████
Achievements           ████████████████████
Progress               ████████████████████
Local Persistence      ████████████████████
```

### Current limitations

* Some non-strength disciplines currently contain a smaller exercise collection.
* `ExercisePicker` currently uses `ScrollView` rather than `FlashList`.
* Some muscle-group image assets exist but the active visualization uses the SVG muscle map.
* FastAPI/PostgreSQL are currently not connected to the application.
* Remote synchronization is planned rather than implemented.

---

# `20` — Roadmap

```text
NOW
 │
 ├── Local-first fitness experience
 │
 ▼
NEXT
 │
 ├── Expand exercise library
 ├── Improve exercise list performance
 ├── Expand missions
 └── Expand achievement system
 │
 ▼
THEN
 │
 ├── Advanced analytics
 ├── More progress visualizations
 └── More training insights
 │
 ▼
FUTURE
 │
 ├── Remote DataService
 ├── FastAPI integration
 ├── PostgreSQL persistence
 └── Optional synchronization
```

---

# `21` — What Makes the Project Interesting

MAKSH is not being structured as a collection of disconnected screens.

The major systems share a common data flow:

```text
                    EXERCISE DATA
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
           ROUTINES             FAVORITES
              │
              ↓
          WORKOUTS
              │
       ┌──────┼───────┐
       ↓      ↓       ↓
     SETS   VOLUME    PRs
       │      │       │
       └──────┼───────┘
              ↓
           HISTORY
              │
       ┌──────┴──────┐
       ↓             ↓
   INSIGHTS     ACHIEVEMENTS
       │             │
       └──────┬──────┘
              ↓
          PROGRESS
```

This makes the application behave as a **connected fitness system** rather than an exercise catalog.

---

# `22` — Development Direction

The project is intentionally being developed in stages:

```text
FOUNDATION
     ↓
EXERCISE SYSTEM
     ↓
WORKOUT ENGINE
     ↓
PERSISTENCE
     ↓
PROGRESS & ANALYTICS
     ↓
ACHIEVEMENTS
     ↓
REMOTE DATA LAYER
```

Each stage builds on the previous layer instead of introducing unnecessary infrastructure early.

---

# `23` — MAKSH

<div align="center">

```text
DISCOVER
    ↓
TRAIN
    ↓
TRACK
    ↓
UNDERSTAND
    ↓
IMPROVE
```

### Fitness is not one workout.

### It is the system built around every workout.

<br>

**MAKSH**

*Train. Track. Progress.*

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=gradient" />

</div>
