import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AchievementUnlock,
  Equipment,
  Exercise,
  HistoryEntry,
  LoggedSet,
  MuscleGroup,
  PersonalizationProfile,
  Routine,
  SessionExercise,
  UserSettings,
  WorkoutSession,
} from "../types";
import { getDataService } from "../services/DataService";
import { STARTER_ROUTINES } from "../data/routineTemplates";
import { EXERCISE_LIBRARY } from "../data/exercises";
import { evaluateAchievements, type AchievementWithProgress } from "../utils/achievementEngine";
import { computeSessionTotals } from "../utils/volumeCalc";

const dataService = getDataService();

// =====================================================================
// Routines
// =====================================================================
interface RoutinesValue {
  routines: Routine[];
  upsertRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  getRoutine: (id: string) => Routine | undefined;
}
const RoutinesContext = createContext<RoutinesValue | null>(null);
export function useRoutines(): RoutinesValue {
  const ctx = useContext(RoutinesContext);
  if (!ctx) throw new Error("useRoutines() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// History
// =====================================================================
interface HistoryValue {
  history: HistoryEntry[];
}
const HistoryContext = createContext<HistoryValue | null>(null);
export function useHistory(): HistoryValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Exercise library (built-in + custom)
// =====================================================================
export type NewCustomExerciseInput = Pick<
  Exercise,
  "name" | "category" | "equipment" | "primaryMuscles" | "secondaryMuscles"
>;
interface ExerciseLibraryValue {
  library: Exercise[];
  addCustomExercise: (input: NewCustomExerciseInput) => Exercise;
  favoriteIds: string[];
  toggleFavorite: (exerciseId: string) => void;
}
const ExerciseLibraryContext = createContext<ExerciseLibraryValue | null>(null);
export function useExerciseLibrary(): ExerciseLibraryValue {
  const ctx = useContext(ExerciseLibraryContext);
  if (!ctx) throw new Error("useExerciseLibrary() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Active session
// =====================================================================
interface SessionValue {
  session: WorkoutSession | null;
  startSession: (routine: Routine | null) => void;
  updateSet: (exerciseIndex: number, setIndex: number, patch: Partial<LoggedSet>) => void;
  addExerciseToSession: (exercise: Exercise) => void;
  finishSession: () => HistoryEntry | null;
  discardSession: () => void;
}
const SessionContext = createContext<SessionValue | null>(null);
export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Achievements (derived from History, not independently editable)
// =====================================================================
interface AchievementsValue {
  achievements: AchievementWithProgress[];
}
const AchievementsContext = createContext<AchievementsValue | null>(null);
export function useAchievements(): AchievementsValue {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Settings
// =====================================================================
interface SettingsValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
}
const SettingsContext = createContext<SettingsValue | null>(null);
export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Personalization (the PersonalizePath quiz — captured once, editable later)
// =====================================================================
interface PersonalizationValue {
  profile: PersonalizationProfile;
  updateProfile: (patch: Partial<PersonalizationProfile>) => void;
}
const PersonalizationContext = createContext<PersonalizationValue | null>(null);
export function usePersonalization(): PersonalizationValue {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error("usePersonalization() must be called within <AppDataProvider>");
  return ctx;
}

// =====================================================================
// Provider
// =====================================================================
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [achievementUnlocks, setAchievementUnlocks] = useState<AchievementUnlock[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>({
    dailyGoalMinutes: 45,
    unit: "lb",
    favoriteExerciseIds: [],
  });
  const [personalization, setPersonalization] = useState<PersonalizationProfile>({
    experienceLevel: "none",
    primaryGoal: "muscle",
    daysPerWeek: 3,
    equipment: "fullGym",
    completedAt: null,
  });
  const [session, setSession] = useState<WorkoutSession | null>(null);

  // One combined boot-time read — this is the "single AsyncStorage read"
  // referenced in the architecture notes; every slice below only ever
  // writes back its own key after this point, so there's no cross-slice
  // write race during startup.
  useEffect(() => {
    (async () => {
      const [r, h, ce, au, s, active, p] = await Promise.all([
        dataService.getRoutines(STARTER_ROUTINES),
        dataService.getHistory(),
        dataService.getCustomExercises(),
        dataService.getAchievementUnlocks(),
        dataService.getSettings(),
        dataService.getActiveSession(),
        dataService.getPersonalization(),
      ]);
      setRoutines(r);
      setHistory(h);
      setCustomExercises(ce);
      setAchievementUnlocks(au);
      setSettingsState(s);
      setSession(active);
      setPersonalization(p);
      setLoading(false);
    })();
  }, []);

  // ---------- Routines ----------
  const upsertRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === routine.id);
      const next = idx >= 0 ? prev.map((r, i) => (i === idx ? routine : r)) : [...prev, routine];
      dataService.setRoutines(next);
      return next;
    });
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      dataService.setRoutines(next);
      return next;
    });
  }, []);

  const getRoutine = useCallback((id: string) => routines.find((r) => r.id === id), [routines]);

  const routinesValue = useMemo<RoutinesValue>(
    () => ({ routines, upsertRoutine, deleteRoutine, getRoutine }),
    [routines, upsertRoutine, deleteRoutine, getRoutine]
  );

  // ---------- History ----------
  const addHistoryEntry = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev];
      dataService.setHistory(next);
      return next;
    });
  }, []);

  const historyValue = useMemo<HistoryValue>(() => ({ history }), [history]);

  // ---------- Exercise library ----------
  const fullLibrary = useMemo(() => [...EXERCISE_LIBRARY, ...customExercises], [customExercises]);

  const addCustomExercise = useCallback((input: NewCustomExerciseInput): Exercise => {
    const exercise: Exercise = {
      id: `custom-${Date.now()}`,
      aliases: [],
      isCustom: true,
      discipline: "strength",
      difficulty: "intermediate",
      tags: input.equipment === "bodyweight" ? ["noEquipment"] : [],
      ...input,
    };
    setCustomExercises((prev) => {
      const next = [...prev, exercise];
      dataService.setCustomExercises(next);
      return next;
    });
    return exercise;
  }, []);

  const toggleFavorite = useCallback((exerciseId: string) => {
    setSettingsState((prev) => {
      const has = prev.favoriteExerciseIds.includes(exerciseId);
      const next = {
        ...prev,
        favoriteExerciseIds: has
          ? prev.favoriteExerciseIds.filter((id) => id !== exerciseId)
          : [...prev.favoriteExerciseIds, exerciseId],
      };
      dataService.setSettings(next);
      return next;
    });
  }, []);

  const libraryValue = useMemo<ExerciseLibraryValue>(
    () => ({ library: fullLibrary, addCustomExercise, favoriteIds: settings.favoriteExerciseIds, toggleFavorite }),
    [fullLibrary, addCustomExercise, settings.favoriteExerciseIds, toggleFavorite]
  );

  // ---------- Active session ----------
  const startSession = useCallback(
    (routine: Routine | null) => {
      const exercises: SessionExercise[] = (routine?.exercises ?? []).map((rex) => {
        const exercise = fullLibrary.find((e) => e.id === rex.exerciseId);
        return {
          exerciseId: rex.exerciseId,
          name: exercise?.name ?? "Unknown Exercise",
          category: exercise?.category ?? "chest",
          primaryMuscles: exercise?.primaryMuscles ?? [],
          secondaryMuscles: exercise?.secondaryMuscles ?? [],
          sets: rex.sets.map((s) => ({
            weight: s.targetWeight,
            reps: s.targetReps,
            isWarmup: s.isWarmup,
            completed: false,
          })),
        };
      });
      const newSession: WorkoutSession = {
        id: `session-${Date.now()}`,
        routineId: routine?.id ?? null,
        routineName: routine?.name ?? "Freestyle Workout",
        mood: routine?.mood ?? "plasma",
        startedAt: Date.now(),
        exercises,
      };
      setSession(newSession);
      dataService.setActiveSession(newSession);
    },
    [fullLibrary]
  );

  const updateSet = useCallback(
    (exerciseIndex: number, setIndex: number, patch: Partial<LoggedSet>) => {
      setSession((prev) => {
        if (!prev) return prev;
        const exercises = [...prev.exercises];
        const sets = [...exercises[exerciseIndex].sets];
        sets[setIndex] = { ...sets[setIndex], ...patch };
        exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };
        const next = { ...prev, exercises };
        dataService.setActiveSession(next);
        return next;
      });
    },
    []
  );

  const addExerciseToSession = useCallback((exercise: Exercise) => {
    setSession((prev) => {
      if (!prev) return prev;
      const sessionExercise: SessionExercise = {
        exerciseId: exercise.id,
        name: exercise.name,
        category: exercise.category,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        sets: [{ weight: 0, reps: 0, isWarmup: false, completed: false }],
      };
      const next = { ...prev, exercises: [...prev.exercises, sessionExercise] };
      dataService.setActiveSession(next);
      return next;
    });
  }, []);

  // Reads `session` directly rather than nesting inside a setSession
  // updater, so building the HistoryEntry and appending it happen as two
  // plain, sequential calls instead of a setState-inside-setState.
  const finishSession = useCallback((): HistoryEntry | null => {
    if (!session) return null;
    const totals = computeSessionTotals(session.exercises);
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      routineId: session.routineId,
      routineName: session.routineName,
      mood: session.mood,
      date: new Date().toISOString(),
      durationSec: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
      exercises: session.exercises,
      musclesTrained: totals.musclesTrained,
      totalVolume: totals.totalVolume,
      totalSets: totals.totalSets,
      totalReps: totals.totalReps,
    };
    addHistoryEntry(entry);
    setSession(null);
    dataService.setActiveSession(null);
    return entry;
  }, [session, addHistoryEntry]);

  const discardSession = useCallback(() => {
    setSession(null);
    dataService.setActiveSession(null);
  }, []);

  const sessionValue = useMemo<SessionValue>(
    () => ({ session, startSession, updateSet, addExerciseToSession, finishSession, discardSession }),
    [session, startSession, updateSet, addExerciseToSession, finishSession, discardSession]
  );

  // ---------- Achievements ----------
  // Recomputed from scratch on every history/unlocks change (cheap at this
  // data scale) so a newly-added achievement in achievements.ts "just
  // works" retroactively. The effect below is what makes newly-crossed
  // thresholds "stick" — otherwise unlockedAt would be regenerated fresh
  // on every evaluation instead of being fixed the first time.
  const evaluation = useMemo(
    () => evaluateAchievements(history, achievementUnlocks),
    [history, achievementUnlocks]
  );

  useEffect(() => {
    const changed =
      JSON.stringify(evaluation.unlocksToPersist) !== JSON.stringify(achievementUnlocks);
    if (changed) {
      setAchievementUnlocks(evaluation.unlocksToPersist);
      dataService.setAchievementUnlocks(evaluation.unlocksToPersist);
    }
    // achievementUnlocks intentionally excluded: it's the comparison target,
    // including it would re-fire this effect on the write it just made.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluation.unlocksToPersist]);

  const achievementsValue = useMemo<AchievementsValue>(
    () => ({ achievements: evaluation.results }),
    [evaluation.results]
  );

  // ---------- Settings ----------
  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      dataService.setSettings(next);
      return next;
    });
  }, []);

  const settingsValue = useMemo<SettingsValue>(
    () => ({ settings, updateSettings }),
    [settings, updateSettings]
  );

  // ---------- Personalization ----------
  const updateProfile = useCallback((patch: Partial<PersonalizationProfile>) => {
    setPersonalization((prev) => {
      const next = { ...prev, ...patch };
      dataService.setPersonalization(next);
      return next;
    });
  }, []);

  const personalizationValue = useMemo<PersonalizationValue>(
    () => ({ profile: personalization, updateProfile }),
    [personalization, updateProfile]
  );

  if (loading) return null; // app/_layout.tsx shows the splash screen until this flips

  return (
    <RoutinesContext.Provider value={routinesValue}>
      <HistoryContext.Provider value={historyValue}>
        <ExerciseLibraryContext.Provider value={libraryValue}>
          <SessionContext.Provider value={sessionValue}>
            <AchievementsContext.Provider value={achievementsValue}>
              <SettingsContext.Provider value={settingsValue}>
                <PersonalizationContext.Provider value={personalizationValue}>
                  {children}
                </PersonalizationContext.Provider>
              </SettingsContext.Provider>
            </AchievementsContext.Provider>
          </SessionContext.Provider>
        </ExerciseLibraryContext.Provider>
      </HistoryContext.Provider>
    </RoutinesContext.Provider>
  );
}
