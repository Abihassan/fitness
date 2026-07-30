import type { HistoryEntry, PersonalRecord } from "../types";

/** Epley formula — the standard, simple estimated-1RM approximation.
 * 1RM = weight * (1 + reps / 30). Good to ~10 reps; accuracy degrades past that,
 * which is true of every bodyweight-based 1RM formula, not just this one. */
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Scans every logged (non-warmup) set across all history and returns the
 * best-known PR per exercise: both the heaviest single set actually logged,
 * and the highest *estimated* 1RM derived from any set (a lighter set for
 * more reps can imply a higher 1RM than a heavier set for fewer reps).
 */
export function computePersonalRecords(history: HistoryEntry[]): Record<string, PersonalRecord> {
  const records: Record<string, PersonalRecord> = {};

  for (const entry of history) {
    for (const ex of entry.exercises) {
      for (const set of ex.sets) {
        if (set.isWarmup || !set.completed || set.weight <= 0) continue;

        const existing = records[ex.exerciseId];
        const est = estimate1RM(set.weight, set.reps);

        if (!existing) {
          records[ex.exerciseId] = {
            exerciseId: ex.exerciseId,
            exerciseName: ex.name,
            maxWeight: { value: set.weight, reps: set.reps, date: entry.date },
            estimated1RM: { value: est, date: entry.date },
          };
          continue;
        }

        if (set.weight > existing.maxWeight.value) {
          existing.maxWeight = { value: set.weight, reps: set.reps, date: entry.date };
        }
        if (est > existing.estimated1RM.value) {
          existing.estimated1RM = { value: est, date: entry.date };
        }
      }
    }
  }

  return records;
}

/**
 * Counts how many "new PR" events have occurred across history, in
 * chronological order — used by the Achievements engine's prCount metric.
 * A PR event fires when a set beats every set logged for that exercise
 * *before* it (by estimated 1RM), not just the final overall max.
 */
export function countPrEvents(history: HistoryEntry[]): number {
  const chronological = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const bestSoFar: Record<string, number> = {};
  let prCount = 0;

  for (const entry of chronological) {
    for (const ex of entry.exercises) {
      for (const set of ex.sets) {
        if (set.isWarmup || !set.completed || set.weight <= 0) continue;
        const est = estimate1RM(set.weight, set.reps);
        const prev = bestSoFar[ex.exerciseId] ?? 0;
        if (est > prev) {
          bestSoFar[ex.exerciseId] = est;
          prCount += 1;
        }
      }
    }
  }
  return prCount;
}
