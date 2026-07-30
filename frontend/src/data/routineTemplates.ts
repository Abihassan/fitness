import type { Routine, RoutineExercise, RoutineSet } from "../types";
import { EXERCISE_LIBRARY } from "./exercises";

function byName(name: string): string {
  const found = EXERCISE_LIBRARY.find((e) => e.name === name);
  if (!found) throw new Error(`routineTemplates: unknown exercise "${name}"`);
  return found.id;
}

let setSeq = 0;
function sets(count: number, reps: number, weight: number, warmupCount = 0): RoutineSet[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `set-${++setSeq}`,
    targetReps: reps,
    targetWeight: weight,
    isWarmup: i < warmupCount,
  }));
}

let exSeq = 0;
function routineExercise(
  exerciseName: string,
  setList: RoutineSet[],
  opts: { restSec?: number; superset?: boolean } = {}
): RoutineExercise {
  return {
    id: `rex-${++exSeq}`,
    exerciseId: byName(exerciseName),
    order: exSeq,
    supersetWithNext: opts.superset ?? false,
    restSec: opts.restSec ?? 90,
    sets: setList,
  };
}

const now = new Date().toISOString();

export const STARTER_ROUTINES: Routine[] = [
  {
    id: "routine-push",
    name: "Push Day",
    mood: "ember",
    createdAt: now,
    updatedAt: now,
    exercises: [
      routineExercise("Push-Up", sets(2, 15, 0, 1), { restSec: 45 }),
      routineExercise("Barbell Bench Press", sets(4, 6, 60), { restSec: 120 }),
      routineExercise("Barbell Overhead Press", sets(3, 8, 35), { restSec: 90 }),
      routineExercise("Incline Dumbbell Press", sets(3, 10, 22), { restSec: 90 }),
      routineExercise("Seated Dumbbell Lateral Raise", sets(3, 12, 8), { restSec: 45, superset: true }),
      routineExercise("Cable Rope Overhead Triceps Extension", sets(3, 12, 20), { restSec: 45 }),
    ],
  },
  {
    id: "routine-pull",
    name: "Pull Day",
    mood: "plasma",
    createdAt: now,
    updatedAt: now,
    exercises: [
      routineExercise("Deadlift", sets(4, 5, 90), { restSec: 150 }),
      routineExercise("Pull-Up", sets(4, 8, 0), { restSec: 90 }),
      routineExercise("Bent-Over Barbell Row", sets(3, 10, 50), { restSec: 90 }),
      routineExercise("Face Pull", sets(3, 15, 12), { restSec: 45, superset: true }),
      routineExercise("Barbell Curl", sets(3, 12, 20), { restSec: 45 }),
    ],
  },
  {
    id: "routine-legs",
    name: "Leg Day",
    mood: "volt",
    createdAt: now,
    updatedAt: now,
    exercises: [
      routineExercise("Barbell Back Squat", sets(4, 6, 70), { restSec: 150 }),
      routineExercise("Romanian Deadlift", sets(3, 10, 50), { restSec: 120 }),
      routineExercise("Walking Lunge", sets(3, 12, 16), { restSec: 60 }),
      routineExercise("Leg Press", sets(3, 12, 90), { restSec: 90 }),
      routineExercise("Standing Calf Raise", sets(4, 15, 40), { restSec: 45 }),
    ],
  },
  {
    id: "routine-core",
    name: "Core & Conditioning",
    mood: "ember",
    createdAt: now,
    updatedAt: now,
    exercises: [
      routineExercise("Hanging Leg Raise", sets(3, 12, 0), { restSec: 45 }),
      // Note: RoutineSet has no separate "hold" unit — for a timed exercise
      // like Plank, targetReps is read as seconds-held rather than rep count.
      routineExercise("Plank", sets(3, 60, 0), { restSec: 45 }),
      routineExercise("Kettlebell Swing", sets(4, 15, 16), { restSec: 60 }),
      routineExercise("Cable Woodchop", sets(3, 12, 15), { restSec: 45 }),
    ],
  },
];
