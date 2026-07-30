import type { MuscleGroup } from "../types";

export interface MuscleMeta {
  key: MuscleGroup;
  label: string;
  shortLabel: string; // for tight chip/legend space
  view: "front" | "back" | "both"; // which MuscleMap silhouette shows it
}

// Order here drives both the filter-chip row on Screen 03 and the legend
// under MuscleMap — keep "All" logic in the consuming component, not here.
export const MUSCLE_GROUPS: MuscleMeta[] = [
  { key: "chest", label: "Chest", shortLabel: "Chest", view: "front" },
  { key: "upperBack", label: "Upper Back", shortLabel: "Up. Back", view: "back" },
  { key: "lats", label: "Lats", shortLabel: "Lats", view: "back" },
  { key: "frontDelts", label: "Front Delts", shortLabel: "Fr. Delts", view: "front" },
  { key: "sideDelts", label: "Side Delts", shortLabel: "Side Delts", view: "both" },
  { key: "rearDelts", label: "Rear Delts", shortLabel: "Rear Delts", view: "back" },
  { key: "upperTraps", label: "Upper Traps", shortLabel: "Traps", view: "back" },
  { key: "biceps", label: "Biceps", shortLabel: "Biceps", view: "front" },
  { key: "triceps", label: "Triceps", shortLabel: "Triceps", view: "back" },
  { key: "forearms", label: "Forearms", shortLabel: "Forearms", view: "both" },
  { key: "abs", label: "Abs", shortLabel: "Abs", view: "front" },
  { key: "obliques", label: "Obliques", shortLabel: "Obliques", view: "front" },
  { key: "lowerBack", label: "Lower Back", shortLabel: "Low. Back", view: "back" },
  { key: "neck", label: "Neck", shortLabel: "Neck", view: "both" },
  { key: "serratus", label: "Serratus", shortLabel: "Serratus", view: "front" },
  { key: "quads", label: "Quads", shortLabel: "Quads", view: "front" },
  { key: "hamstrings", label: "Hamstrings", shortLabel: "Hams", view: "back" },
  { key: "glutes", label: "Glutes", shortLabel: "Glutes", view: "back" },
  { key: "calves", label: "Calves", shortLabel: "Calves", view: "both" },
  { key: "abductors", label: "Abductors", shortLabel: "Abductors", view: "both" },
  { key: "adductors", label: "Adductors", shortLabel: "Adductors", view: "front" },
  { key: "tibialis", label: "Tibialis", shortLabel: "Tibialis", view: "front" },
];

export const MUSCLE_LABEL: Record<MuscleGroup, string> = MUSCLE_GROUPS.reduce(
  (acc, m) => ({ ...acc, [m.key]: m.label }),
  {} as Record<MuscleGroup, string>
);

export function muscleLabel(key: MuscleGroup): string {
  return MUSCLE_LABEL[key] ?? key;
}

// Coarser grouping for Screen 03's horizontal filter chips ("All, Chest,
// Back, Lats, Shoulders, Biceps, ..."), which shouldn't force the user to
// know the 22-way fine taxonomy MuscleMap uses internally.
export interface CategoryChip {
  label: string;
  matches: MuscleGroup[] | null; // null = "All"
}

export const CATEGORY_CHIPS: CategoryChip[] = [
  { label: "All", matches: null },
  { label: "Chest", matches: ["chest"] },
  { label: "Back", matches: ["upperBack", "lowerBack"] },
  { label: "Lats", matches: ["lats"] },
  { label: "Shoulders", matches: ["frontDelts", "sideDelts", "rearDelts", "upperTraps"] },
  { label: "Biceps", matches: ["biceps"] },
  { label: "Triceps", matches: ["triceps"] },
  { label: "Forearms", matches: ["forearms"] },
  { label: "Core", matches: ["abs", "obliques", "serratus"] },
  {
    label: "Legs",
    matches: ["quads", "hamstrings", "glutes", "calves", "abductors", "adductors", "tibialis"],
  },
];
