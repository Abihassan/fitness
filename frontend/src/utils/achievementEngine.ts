import type { Achievement, AchievementUnlock, HistoryEntry } from "../types";
import { ACHIEVEMENTS } from "../data/achievements";
import { computePersonalRecords, countPrEvents } from "./prCalc";
import { totalSetsAllTime, totalRepsAllTime, totalVolumeAllTime } from "./volumeCalc";
import { computeStreak, isoDay } from "./dateUtils";

export interface AchievementWithProgress extends Achievement {
  progressValue: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

function metricValue(achievement: Achievement, history: HistoryEntry[]): number {
  const { metric, exerciseId } = achievement.criteria;
  switch (metric) {
    case "totalWorkouts":
      return history.length;
    case "totalSetsLogged":
      return totalSetsAllTime(history);
    case "totalReps":
      return totalRepsAllTime(history);
    case "totalVolume":
      return totalVolumeAllTime(history);
    case "prCount":
      return countPrEvents(history);
    case "streakDays":
      return computeStreak(history.map((h) => isoDay(new Date(h.date))));
    case "exerciseMaxWeight": {
      if (!exerciseId) return 0;
      const records = computePersonalRecords(history);
      return records[exerciseId]?.maxWeight.value ?? 0;
    }
    default:
      return 0;
  }
}

/**
 * Pure evaluation: given the full history and the previously-persisted
 * unlock timestamps, returns every achievement with its current progress —
 * re-derived from scratch every time this runs (cheap enough at this data
 * scale) so newly-added achievements retroactively "just work" without a
 * migration step. Only the unlockedAt moment itself is ever persisted, and
 * only the first time a badge crosses its threshold, so it never drifts.
 */
export function evaluateAchievements(
  history: HistoryEntry[],
  previousUnlocks: AchievementUnlock[]
): { results: AchievementWithProgress[]; unlocksToPersist: AchievementUnlock[] } {
  const previousMap = new Map(previousUnlocks.map((u) => [u.achievementId, u]));
  const unlocksToPersist: AchievementUnlock[] = [];

  const results = ACHIEVEMENTS.map((achievement) => {
    const value = metricValue(achievement, history);
    const meetsThreshold = value >= achievement.criteria.threshold;
    const previous = previousMap.get(achievement.id);

    let unlockedAt: string | null = previous?.unlockedAt ?? null;
    if (meetsThreshold && !unlockedAt) {
      unlockedAt = new Date().toISOString();
    }

    unlocksToPersist.push({ achievementId: achievement.id, unlockedAt });

    return {
      ...achievement,
      progressValue: value,
      unlocked: unlockedAt !== null,
      unlockedAt,
    };
  });

  return { results, unlocksToPersist };
}
