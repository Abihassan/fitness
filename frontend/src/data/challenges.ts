import type { Challenge } from "../types";
import { EXERCISE_LIBRARY } from "./exercises";

function idsFor(names: string[]): string[] {
  return names
    .map((n) => EXERCISE_LIBRARY.find((e) => e.name === n)?.id)
    .filter((id): id is string => Boolean(id));
}

export const CHALLENGES: Challenge[] = [
  {
    id: "chal-plank-week",
    name: "7-Day Plank Challenge",
    description: "One core hold a day, building duration through the week.",
    durationLabel: "7 days",
    exerciseIds: idsFor(["Plank", "Hollow Body Hold", "Dead Bug"]),
  },
  {
    id: "chal-pushup-progression",
    name: "Push-Up Progression",
    description: "Build toward strict push-up volume with supporting pulls.",
    durationLabel: "4 weeks",
    exerciseIds: idsFor(["Push-Up", "Bench Dip", "Australian Row"]),
  },
  {
    id: "chal-mobility-reset",
    name: "10-Minute Mobility Reset",
    description: "A short full-body mobility flow for rest days.",
    durationLabel: "10 min",
    exerciseIds: idsFor(["Cat-Cow", "Thoracic Spine Rotation", "Hip Circles", "90/90 Hip Switch"]),
  },
];
