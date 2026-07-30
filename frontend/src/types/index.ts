// Central type definitions. Nothing in here touches AsyncStorage or React —
// pure data shapes only, so any file can import from here with zero risk of
// circular imports back into context/storage code.

export type MuscleGroup =
  | "chest"
  | "upperBack"
  | "lats"
  | "frontDelts"
  | "sideDelts"
  | "rearDelts"
  | "upperTraps"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "lowerBack"
  | "neck"
  | "serratus"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abductors"
  | "adductors"
  | "tibialis";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "kettlebell";

/** Broader "what kind of exercise is this" classification — layered on top
 * of MuscleGroup rather than replacing it. Strength exercises keep their
 * muscle-group category (needed for routines/logging/the muscle map);
 * every exercise, strength or not, also gets a discipline so the wider
 * library (yoga, cardio, mobility...) has a home. */
export type Discipline =
  | "strength"
  | "cardio"
  | "hiit"
  | "calisthenics"
  | "mobility"
  | "yoga"
  | "pilates"
  | "stretching"
  | "balance";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Cross-cutting attribute flags — how "Warm-Up," "No Equipment," "Time
 * Based" etc. work as filters over one shared list instead of separate
 * hand-maintained content silos. */
export type ExerciseTag = "warmup" | "cooldown" | "rehab" | "noEquipment" | "challenge";

export type Mood = "volt" | "plasma" | "ember";

/** A library exercise — the catalog Screen 03 searches/filters over. */
export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: MuscleGroup; // primary filter-chip bucket (strength exercises)
  equipment: Equipment;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  discipline: Discipline;
  difficulty: Difficulty;
  durationSec?: number; // set for held/timed movements (planks, stretches, yoga poses)
  tags: ExerciseTag[];
  description?: string;
  isCustom?: boolean;
}

/** A short curated multi-exercise collection — what the "Challenges"
 * category actually is, distinct from a single filtered exercise list. */
export interface Challenge {
  id: string;
  name: string;
  description: string;
  durationLabel: string; // e.g. "7 days", "20 min"
  exerciseIds: string[];
}

/** One planned set inside a routine (targets, not actuals). */
export interface RoutineSet {
  id: string;
  targetWeight: number;
  targetReps: number;
  isWarmup: boolean;
}

/** An exercise as it's configured inside a specific routine. */
export interface RoutineExercise {
  id: string;
  exerciseId: string; // -> Exercise.id
  order: number;
  supersetWithNext: boolean;
  restSec: number;
  sets: RoutineSet[];
}

export interface Routine {
  id: string;
  name: string;
  mood: Mood;
  exercises: RoutineExercise[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** One completed set, logged live during a session. */
export interface LoggedSet {
  weight: number;
  reps: number;
  isWarmup: boolean;
  completed: boolean;
}

/** A single exercise's log within an in-progress or finished session. */
export interface SessionExercise {
  exerciseId: string;
  name: string;
  category: MuscleGroup;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  sets: LoggedSet[];
}

/** The active, in-progress workout. Lives only in memory + a lightweight
 * AsyncStorage mirror for crash recovery — never written to History until
 * the user explicitly finishes it. */
export interface WorkoutSession {
  id: string;
  routineId: string | null;
  routineName: string;
  mood: Mood;
  startedAt: number; // epoch ms
  exercises: SessionExercise[];
}

/** One finished, permanent workout record. */
export interface HistoryEntry {
  id: string;
  routineId: string | null;
  routineName: string;
  mood: Mood;
  date: string; // ISO
  durationSec: number;
  exercises: SessionExercise[];
  musclesTrained: MuscleGroup[]; // derived once at save time, cached
  totalVolume: number; // derived once at save time, cached (lb)
  totalSets: number; // derived, cached
  totalReps: number; // derived, cached
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: { value: number; reps: number; date: string };
  estimated1RM: { value: number; date: string }; // Epley: w * (1 + reps/30)
}

export type AchievementCategory = "milestones" | "volume" | "strength";

export type AchievementMetric =
  | "totalWorkouts"
  | "totalSetsLogged"
  | "totalReps"
  | "totalVolume"
  | "prCount"
  | "streakDays"
  | "exerciseMaxWeight";

export interface Achievement {
  id: string;
  category: AchievementCategory;
  name: string;
  description: string;
  icon: string; // lucide icon name, resolved in BadgeCard
  criteria: {
    metric: AchievementMetric;
    threshold: number;
    exerciseId?: string; // only used when metric === "exerciseMaxWeight"
  };
}

/** Persisted separately from the Achievement config so unlock dates never
 * shift if criteria definitions change later. */
export interface AchievementUnlock {
  achievementId: string;
  unlockedAt: string | null; // ISO, or null while locked
}

/** Answers captured once, during PersonalizePathScreen — used to seed
 * sensible defaults (which starter routine to suggest, the daily goal)
 * rather than to gate any feature. Re-editable later from Profile. */
export interface PersonalizationProfile {
  experienceLevel: "none" | "beginner" | "intermediate" | "advanced";
  primaryGoal: "strength" | "muscle" | "fatLoss" | "endurance" | "wellbeing";
  daysPerWeek: number;
  equipment: "fullGym" | "homeBasic" | "bodyweightOnly";
  completedAt: string | null; // ISO, null until the quiz has been finished once
}

export interface UserSettings {
  dailyGoalMinutes: number;
  unit: "lb" | "kg";
  favoriteExerciseIds: string[];
}
