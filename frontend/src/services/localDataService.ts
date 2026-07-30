import { storage } from "../storage/storage";
import type { DataService } from "./DataService";

/** Thin adapter: DataService's shape, backed by storage.ts. No logic lives
 * here on purpose — if this file starts growing real business logic,
 * that's a sign it belongs in AppDataProvider instead, above the seam. */
export const localDataService: DataService = {
  getRoutines: storage.getRoutines,
  setRoutines: storage.setRoutines,
  getHistory: storage.getHistory,
  setHistory: storage.setHistory,
  getActiveSession: storage.getActiveSession,
  setActiveSession: storage.setActiveSession,
  getCustomExercises: storage.getCustomExercises,
  setCustomExercises: storage.setCustomExercises,
  getAchievementUnlocks: storage.getAchievementUnlocks,
  setAchievementUnlocks: storage.setAchievementUnlocks,
  getSettings: storage.getSettings,
  setSettings: storage.setSettings,
  getPersonalization: storage.getPersonalization,
  setPersonalization: storage.setPersonalization,
};
