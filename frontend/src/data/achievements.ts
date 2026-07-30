import type { Achievement } from "../types";

// Pure config — no logic here. src/utils/achievementEngine.ts scans History
// against these criteria and returns unlock state; this file only defines
// *what* the badges are.
export const ACHIEVEMENTS: Achievement[] = [
  // ---------- Milestones (workout count + streaks) ----------
  { id: "m-first-rep", category: "milestones", name: "First Rep", description: "Log your first workout.", icon: "Target", criteria: { metric: "totalWorkouts", threshold: 1 } },
  { id: "m-getting-serious", category: "milestones", name: "Getting Serious", description: "Log 10 workouts.", icon: "Flame", criteria: { metric: "totalWorkouts", threshold: 10 } },
  { id: "m-gym-regular", category: "milestones", name: "Gym Regular", description: "Log 50 workouts.", icon: "Trophy", criteria: { metric: "totalWorkouts", threshold: 50 } },
  { id: "m-century-club", category: "milestones", name: "Century Club", description: "Log 100 workouts.", icon: "Award", criteria: { metric: "totalWorkouts", threshold: 100 } },
  { id: "m-iron-veteran", category: "milestones", name: "Iron Veteran", description: "Log 500 workouts.", icon: "Swords", criteria: { metric: "totalWorkouts", threshold: 500 } },
  { id: "m-on-fire", category: "milestones", name: "On Fire", description: "Train 7 days in a row.", icon: "Flame", criteria: { metric: "streakDays", threshold: 7 } },
  { id: "m-unstoppable", category: "milestones", name: "Unstoppable", description: "Train 30 days in a row.", icon: "Zap", criteria: { metric: "streakDays", threshold: 30 } },

  // ---------- Volume (sets / reps / total lb lifted) ----------
  { id: "v-set-stacker", category: "volume", name: "Set Stacker", description: "Log 100 total sets.", icon: "Layers", criteria: { metric: "totalSetsLogged", threshold: 100 } },
  { id: "v-volume-machine", category: "volume", name: "Volume Machine", description: "Log 1,000 total sets.", icon: "BarChart3", criteria: { metric: "totalSetsLogged", threshold: 1000 } },
  { id: "v-set-legend", category: "volume", name: "Set Legend", description: "Log 5,000 total sets.", icon: "Crown", criteria: { metric: "totalSetsLogged", threshold: 5000 } },
  { id: "v-rep-machine", category: "volume", name: "Rep Machine", description: "Log 10,000 total reps.", icon: "RotateCw", criteria: { metric: "totalReps", threshold: 10000 } },
  { id: "v-ton-lifter", category: "volume", name: "Ton Lifter", description: "Lift 100,000 lb total volume.", icon: "Weight", criteria: { metric: "totalVolume", threshold: 100000 } },

  // ---------- Strength (personal records) ----------
  { id: "s-record-breaker", category: "strength", name: "Record Breaker", description: "Set your first personal record.", icon: "TrendingUp", criteria: { metric: "prCount", threshold: 1 } },
  { id: "s-pr-hunter", category: "strength", name: "PR Hunter", description: "Set 10 personal records.", icon: "Medal", criteria: { metric: "prCount", threshold: 10 } },
  { id: "s-record-machine", category: "strength", name: "Record Machine", description: "Set 50 personal records.", icon: "Crown", criteria: { metric: "prCount", threshold: 50 } },
];

export function achievementsByCategory() {
  return {
    milestones: ACHIEVEMENTS.filter((a) => a.category === "milestones"),
    volume: ACHIEVEMENTS.filter((a) => a.category === "volume"),
    strength: ACHIEVEMENTS.filter((a) => a.category === "strength"),
  };
}
