import type { Difficulty, Discipline, Exercise, ExerciseTag, MuscleGroup } from "../types";

export type CategoryFilter =
  | { kind: "discipline"; value: Discipline }
  | { kind: "muscle"; value: MuscleGroup[] }
  | { kind: "tag"; value: ExerciseTag }
  | { kind: "difficulty"; value: Difficulty }
  | { kind: "timed" }
  | { kind: "favorites" }
  | { kind: "challenges" };

export interface CategoryMeta {
  key: string;
  label: string;
  icon: any; // require()'d PNG — gym's existing category icon assets
  filter: CategoryFilter;
}

// Every entry here corresponds 1:1 to a category tile gym's original
// ExercisesScreen grid already had — same labels, same icon assets, same
// visual slot. What changes is what tapping it actually shows: instead of
// a hand-written, separately-maintained screen per category, each of
// these resolves to a filter over ONE shared exercise list, so an exercise
// tagged "beginner" + "noEquipment" correctly shows up under both without
// being duplicated anywhere.
export const CATEGORIES: CategoryMeta[] = [
  { key: "strength", label: "Strength", icon: require("../../assets/icons/strength.png"), filter: { kind: "discipline", value: "strength" } },
  { key: "cardio", label: "Cardio", icon: require("../../assets/icons/cardio.png"), filter: { kind: "discipline", value: "cardio" } },
  { key: "hiit", label: "HIIT", icon: require("../../assets/icons/hiit.png"), filter: { kind: "discipline", value: "hiit" } },
  { key: "calisthenics", label: "Calisthenics", icon: require("../../assets/icons/calisthenics.png"), filter: { kind: "discipline", value: "calisthenics" } },
  { key: "mobility", label: "Mobility", icon: require("../../assets/icons/mobility.png"), filter: { kind: "discipline", value: "mobility" } },
  { key: "favorites", label: "Favorites", icon: require("../../assets/icons/favorites.png"), filter: { kind: "favorites" } },
  { key: "coreAbs", label: "Core / Abs", icon: require("../../assets/icons/coreAbs.png"), filter: { kind: "muscle", value: ["abs", "obliques"] } },
  { key: "yoga", label: "Yoga", icon: require("../../assets/icons/yoga.png"), filter: { kind: "discipline", value: "yoga" } },
  { key: "pilates", label: "Pilates", icon: require("../../assets/icons/pilates.png"), filter: { kind: "discipline", value: "pilates" } },
  { key: "stretching", label: "Stretching", icon: require("../../assets/icons/stretching.png"), filter: { kind: "discipline", value: "stretching" } },
  { key: "warmUp", label: "Warm-Up", icon: require("../../assets/icons/warmUp.png"), filter: { kind: "tag", value: "warmup" } },
  { key: "coolDown", label: "Cool-Down", icon: require("../../assets/icons/coolDown.png"), filter: { kind: "tag", value: "cooldown" } },
  { key: "balance", label: "Balance", icon: require("../../assets/icons/balance.png"), filter: { kind: "discipline", value: "balance" } },
  { key: "beginner", label: "Beginner", icon: require("../../assets/icons/beginner.png"), filter: { kind: "difficulty", value: "beginner" } },
  { key: "noEquipment", label: "No Equipment", icon: require("../../assets/icons/noEquipment.png"), filter: { kind: "tag", value: "noEquipment" } },
  { key: "timeBased", label: "Time Based", icon: require("../../assets/icons/timeBased.png"), filter: { kind: "timed" } },
  { key: "rehab", label: "Rehabilitation", icon: require("../../assets/icons/rehab.png"), filter: { kind: "tag", value: "rehab" } },
  { key: "challenges", label: "Challenges", icon: require("../../assets/icons/challenges.png"), filter: { kind: "challenges" } },
];

export function matchesFilter(exercise: Exercise, filter: CategoryFilter, favoriteIds: string[]): boolean {
  switch (filter.kind) {
    case "discipline":
      return exercise.discipline === filter.value;
    case "muscle":
      return filter.value.includes(exercise.category) || exercise.primaryMuscles.some((m) => filter.value.includes(m));
    case "tag":
      return exercise.tags.includes(filter.value);
    case "difficulty":
      return exercise.difficulty === filter.value;
    case "timed":
      return typeof exercise.durationSec === "number" && exercise.durationSec > 0;
    case "favorites":
      return favoriteIds.includes(exercise.id);
    case "challenges":
      return false; // Challenges screen reads from CHALLENGES, not a filtered exercise list
  }
}
