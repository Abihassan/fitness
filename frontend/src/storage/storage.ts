import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import type {
  AchievementUnlock,
  HistoryEntry,
  PersonalizationProfile,
  Routine,
  UserSettings,
  WorkoutSession,
} from "../types";

const KEYS = {
  ROUTINES: "@maksh/routines",
  HISTORY: "@maksh/history",
  ACTIVE_SESSION: "@maksh/active_session",
  CUSTOM_EXERCISES: "@maksh/custom_exercises",
  ACHIEVEMENT_UNLOCKS: "@maksh/achievement_unlocks",
  SETTINGS: "@maksh/settings",
  PERSONALIZATION: "@maksh/personalization",
} as const;

const SECURE_KEYS = {
  ONBOARDED: "maksh_onboarded",
} as const;

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.warn(`storage.read(${key}) failed`, e);
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`storage.write(${key}) failed`, e);
    return false;
  }
}

export const storage = {
  // ---------- Routines ----------
  getRoutines: (fallback: Routine[]) => readJSON(KEYS.ROUTINES, fallback),
  setRoutines: (routines: Routine[]) => writeJSON(KEYS.ROUTINES, routines),

  // ---------- History ----------
  getHistory: () => readJSON<HistoryEntry[]>(KEYS.HISTORY, []),
  setHistory: (history: HistoryEntry[]) => writeJSON(KEYS.HISTORY, history),

  // ---------- In-progress session (crash/kill recovery only) ----------
  getActiveSession: () => readJSON<WorkoutSession | null>(KEYS.ACTIVE_SESSION, null),
  setActiveSession: (session: WorkoutSession | null) => writeJSON(KEYS.ACTIVE_SESSION, session),

  // ---------- Custom exercises added from "Build Custom Exercise" ----------
  getCustomExercises: () => readJSON(KEYS.CUSTOM_EXERCISES, [] as import("../types").Exercise[]),
  setCustomExercises: (exercises: import("../types").Exercise[]) =>
    writeJSON(KEYS.CUSTOM_EXERCISES, exercises),

  // ---------- Achievement unlock timestamps ----------
  getAchievementUnlocks: () => readJSON<AchievementUnlock[]>(KEYS.ACHIEVEMENT_UNLOCKS, []),
  setAchievementUnlocks: (unlocks: AchievementUnlock[]) =>
    writeJSON(KEYS.ACHIEVEMENT_UNLOCKS, unlocks),

  // ---------- Settings ----------
  getSettings: () =>
    readJSON<UserSettings>(KEYS.SETTINGS, { dailyGoalMinutes: 45, unit: "lb", favoriteExerciseIds: [] }),
  setSettings: (settings: UserSettings) => writeJSON(KEYS.SETTINGS, settings),

  // ---------- Personalization quiz (PersonalizePathScreen) ----------
  getPersonalization: () =>
    readJSON<PersonalizationProfile>(KEYS.PERSONALIZATION, {
      experienceLevel: "none",
      primaryGoal: "muscle",
      daysPerWeek: 3,
      equipment: "fullGym",
      completedAt: null,
    }),
  setPersonalization: (profile: PersonalizationProfile) => writeJSON(KEYS.PERSONALIZATION, profile),

  // ---------- Onboarding flag — the one piece that lives in SecureStore ----------
  async getOnboarded(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(SECURE_KEYS.ONBOARDED);
      return value === "true";
    } catch (e) {
      console.warn("secureStore.getOnboarded failed", e);
      return false;
    }
  },
  async setOnboarded(value: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(SECURE_KEYS.ONBOARDED, value ? "true" : "false");
    } catch (e) {
      console.warn("secureStore.setOnboarded failed", e);
    }
  },
};
