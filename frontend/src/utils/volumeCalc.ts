import type { HistoryEntry, MuscleGroup, SessionExercise } from "../types";
import { isoDay } from "./dateUtils";

export interface SessionTotals {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  musclesTrained: MuscleGroup[];
}

/** Rolls a session's (or in-progress workout's) exercises up into the
 * cached totals stored on a HistoryEntry. Every completed set counts,
 * warmups included — a warmup set is still a set you did. */
export function computeSessionTotals(exercises: SessionExercise[]): SessionTotals {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  const muscles = new Set<MuscleGroup>();

  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (!set.completed) continue;
      totalSets += 1;
      totalReps += set.reps;
      totalVolume += set.weight * set.reps;
    }
    if (ex.sets.some((s) => s.completed)) {
      ex.primaryMuscles.forEach((m) => muscles.add(m));
      ex.secondaryMuscles.forEach((m) => muscles.add(m));
    }
  }

  return { totalVolume, totalSets, totalReps, musclesTrained: Array.from(muscles) };
}

export function totalVolumeAllTime(history: HistoryEntry[]): number {
  return history.reduce((sum, h) => sum + h.totalVolume, 0);
}

export function totalSetsAllTime(history: HistoryEntry[]): number {
  return history.reduce((sum, h) => sum + h.totalSets, 0);
}

export function totalRepsAllTime(history: HistoryEntry[]): number {
  return history.reduce((sum, h) => sum + h.totalReps, 0);
}

export function volumeInLastNDays(history: HistoryEntry[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return history
    .filter((h) => new Date(h.date).getTime() >= cutoff)
    .reduce((sum, h) => sum + h.totalVolume, 0);
}

/** Volume per calendar day (ISO date -> lb), for the History month calendar's
 * intensity color-coding. */
export function volumeByIsoDate(history: HistoryEntry[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const h of history) {
    const iso = isoDay(new Date(h.date));
    map[iso] = (map[iso] ?? 0) + h.totalVolume;
  }
  return map;
}

/**
 * Per-muscle training load over a rolling window, weighting primary movers
 * fully and secondary/assisting muscles at half credit, then normalized so
 * the single most-trained muscle reads as 1.0 — ready to feed straight into
 * <MuscleMap intensities={...} />.
 */
export function muscleLoadMap(
  history: HistoryEntry[],
  windowDays: number = 14
): Partial<Record<MuscleGroup, number>> {
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const raw: Partial<Record<MuscleGroup, number>> = {};

  for (const entry of history) {
    if (new Date(entry.date).getTime() < cutoff) continue;
    for (const ex of entry.exercises) {
      const setVolume = ex.sets
        .filter((s) => s.completed)
        .reduce((sum, s) => sum + s.weight * s.reps, 0);
      if (setVolume <= 0) continue;

      ex.primaryMuscles.forEach((m) => {
        raw[m] = (raw[m] ?? 0) + setVolume;
      });
      ex.secondaryMuscles.forEach((m) => {
        raw[m] = (raw[m] ?? 0) + setVolume * 0.5;
      });
    }
  }

  const max = Math.max(1, ...Object.values(raw));
  const normalized: Partial<Record<MuscleGroup, number>> = {};
  (Object.keys(raw) as MuscleGroup[]).forEach((m) => {
    normalized[m] = (raw[m] ?? 0) / max;
  });
  return normalized;
}
