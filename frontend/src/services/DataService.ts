import type {
  AchievementUnlock,
  Exercise,
  HistoryEntry,
  PersonalizationProfile,
  Routine,
  UserSettings,
  WorkoutSession,
} from "../types";

/**
 * Everything AppDataProvider needs, expressed as an interface rather than
 * direct calls into storage.ts. Today, `getDataService()` always returns
 * `localDataService` (a thin wrapper over AsyncStorage/SecureStore — see
 * ./localDataService.ts). The FastAPI backend in /backend is scaffolded
 * but intentionally not wired up yet (see backend/README.md).
 *
 * When that changes, the path is:
 *   1. Implement `remoteDataService.ts` against this exact same interface,
 *      calling the FastAPI routes instead of AsyncStorage.
 *   2. Flip the return value of `getDataService()` below.
 * Nothing in AppDataProvider, screens, or components needs to change —
 * they only ever depend on this interface, never on `localDataService` or
 * AsyncStorage directly.
 */
export interface DataService {
  getRoutines(fallback: Routine[]): Promise<Routine[]>;
  setRoutines(routines: Routine[]): Promise<boolean>;

  getHistory(): Promise<HistoryEntry[]>;
  setHistory(history: HistoryEntry[]): Promise<boolean>;

  getActiveSession(): Promise<WorkoutSession | null>;
  setActiveSession(session: WorkoutSession | null): Promise<boolean>;

  getCustomExercises(): Promise<Exercise[]>;
  setCustomExercises(exercises: Exercise[]): Promise<boolean>;

  getAchievementUnlocks(): Promise<AchievementUnlock[]>;
  setAchievementUnlocks(unlocks: AchievementUnlock[]): Promise<boolean>;

  getSettings(): Promise<UserSettings>;
  setSettings(settings: UserSettings): Promise<boolean>;

  getPersonalization(): Promise<PersonalizationProfile>;
  setPersonalization(profile: PersonalizationProfile): Promise<boolean>;
}

import { localDataService } from "./localDataService";

export function getDataService(): DataService {
  return localDataService;
}
