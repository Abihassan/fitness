import type { Difficulty, Discipline, Equipment, Exercise, ExerciseTag, MuscleGroup } from "../types";

let n = 0;
const nextId = () => `ex-${(++n).toString().padStart(3, "0")}`;

interface ExOptions {
  aliases?: string[];
  difficulty?: Difficulty;
  tags?: ExerciseTag[];
  durationSec?: number;
}

function ex(
  name: string,
  category: MuscleGroup,
  equipment: Equipment,
  primaryMuscles: MuscleGroup[],
  secondaryMuscles: MuscleGroup[] = [],
  opts: ExOptions = {}
): Exercise {
  const tags = new Set(opts.tags ?? []);
  if (equipment === "bodyweight") tags.add("noEquipment");
  return {
    id: nextId(),
    name,
    aliases: opts.aliases ?? [],
    category,
    equipment,
    primaryMuscles,
    secondaryMuscles,
    discipline: "strength",
    difficulty: opts.difficulty ?? "intermediate",
    durationSec: opts.durationSec,
    tags: Array.from(tags),
  };
}

/** Second helper for the non-strength disciplines — no MuscleGroup/equipment
 * modeling needed there, just a name, discipline, and attribute flags. */
function nonStrength(
  name: string,
  discipline: Discipline,
  opts: ExOptions & { difficulty: Difficulty } & { muscles?: MuscleGroup[] }
): Exercise {
  const tags = new Set(opts.tags ?? []);
  tags.add("noEquipment");
  return {
    id: nextId(),
    name,
    aliases: opts.aliases ?? [],
    category: opts.muscles?.[0] ?? "abs",
    equipment: "bodyweight",
    primaryMuscles: opts.muscles ?? [],
    secondaryMuscles: [],
    discipline,
    difficulty: opts.difficulty,
    durationSec: opts.durationSec,
    tags: Array.from(tags),
  };
}

// ---------- Chest ----------
const chest: Exercise[] = [
  ex("Barbell Bench Press", "chest", "barbell", ["chest"], ["triceps", "frontDelts"], { aliases: ["bench press"] }),
  ex("Incline Barbell Bench Press", "chest", "barbell", ["chest"], ["frontDelts", "triceps"]),
  ex("Decline Barbell Bench Press", "chest", "barbell", ["chest"], ["triceps"]),
  ex("Dumbbell Bench Press", "chest", "dumbbell", ["chest"], ["triceps", "frontDelts"]),
  ex("Incline Dumbbell Press", "chest", "dumbbell", ["chest"], ["frontDelts", "triceps"]),
  ex("Decline Dumbbell Press", "chest", "dumbbell", ["chest"], ["triceps"]),
  ex("Dumbbell Fly", "chest", "dumbbell", ["chest"], []),
  ex("Cable Crossover", "chest", "cable", ["chest"], []),
  ex("Pec Deck Machine", "chest", "machine", ["chest"], []),
  ex("Push-Up", "chest", "bodyweight", ["chest"], ["triceps", "frontDelts", "abs"], { difficulty: "beginner", tags: ["warmup"] }),
  ex("Chest Dip", "chest", "bodyweight", ["chest"], ["triceps"]),
  ex("Machine Chest Press", "chest", "machine", ["chest"], ["triceps"]),
];

// ---------- Upper Back / Lats ----------
const back: Exercise[] = [
  ex("Bent-Over Barbell Row", "upperBack", "barbell", ["upperBack"], ["lats", "biceps", "rearDelts"]),
  ex("Pendlay Row", "upperBack", "barbell", ["upperBack"], ["lats", "biceps"]),
  ex("Seated Cable Row", "upperBack", "cable", ["upperBack"], ["lats", "biceps"]),
  ex("Chest-Supported T-Bar Row", "upperBack", "machine", ["upperBack"], ["lats", "biceps"]),
  ex("Face Pull", "rearDelts", "cable", ["rearDelts"], ["upperBack", "upperTraps"], { tags: ["rehab"] }),
  ex("Barbell Shrug", "upperTraps", "barbell", ["upperTraps"], []),
  ex("Dumbbell Shrug", "upperTraps", "dumbbell", ["upperTraps"], []),
  ex("Smith Machine Shrug", "upperTraps", "machine", ["upperTraps"], []),
  ex("Hyperextension", "lowerBack", "bodyweight", ["lowerBack"], ["glutes", "hamstrings"]),
  ex("Good Morning", "lowerBack", "barbell", ["lowerBack"], ["hamstrings", "glutes"]),
];

const lats: Exercise[] = [
  ex("Pull-Up", "lats", "bodyweight", ["lats"], ["biceps", "upperBack"]),
  ex("Overhand Grip Weighted Pull-Up", "lats", "bodyweight", ["lats"], ["biceps", "upperBack"]),
  ex("Chin-Up", "lats", "bodyweight", ["lats"], ["biceps"]),
  ex("Lat Pulldown", "lats", "cable", ["lats"], ["biceps", "upperBack"]),
  ex("Close-Grip Lat Pulldown", "lats", "cable", ["lats"], ["biceps"]),
  ex("Straight-Arm Pulldown", "lats", "cable", ["lats"], []),
  ex("Single-Arm Dumbbell Row", "lats", "dumbbell", ["lats"], ["upperBack", "biceps"]),
  ex("Deadlift", "lats", "barbell", ["lats", "lowerBack"], ["glutes", "hamstrings", "upperTraps"], { aliases: ["conventional deadlift"] }),
];

// ---------- Shoulders ----------
const shoulders: Exercise[] = [
  ex("Barbell Overhead Press", "frontDelts", "barbell", ["frontDelts"], ["triceps", "sideDelts"], { aliases: ["ohp", "military press"] }),
  ex("Dumbbell Shoulder Press", "frontDelts", "dumbbell", ["frontDelts"], ["triceps", "sideDelts"]),
  ex("Machine Shoulder Press", "frontDelts", "machine", ["frontDelts"], ["triceps"]),
  ex("Arnold Press", "frontDelts", "dumbbell", ["frontDelts"], ["sideDelts", "triceps"]),
  ex("Front Raise", "frontDelts", "dumbbell", ["frontDelts"], []),
  ex("Dumbbell Lateral Raise", "sideDelts", "dumbbell", ["sideDelts"], []),
  ex("Seated Dumbbell Lateral Raise", "sideDelts", "dumbbell", ["sideDelts"], []),
  ex("Cable Lateral Raise", "sideDelts", "cable", ["sideDelts"], []),
  ex("Single Arm High Cable Lateral Raise", "sideDelts", "cable", ["sideDelts"], ["frontDelts", "upperTraps"]),
  ex("Reverse Pec Deck Fly", "rearDelts", "machine", ["rearDelts"], ["upperBack"]),
  ex("Overhand Grip Machine Rear Delt Fly", "rearDelts", "machine", ["rearDelts"], ["upperBack", "upperTraps"]),
  ex("Bent-Over Dumbbell Rear Delt Fly", "rearDelts", "dumbbell", ["rearDelts"], ["upperBack"]),
];

// ---------- Arms ----------
const biceps: Exercise[] = [
  ex("Barbell Curl", "biceps", "barbell", ["biceps"], ["forearms"]),
  ex("EZ-Bar Curl", "biceps", "barbell", ["biceps"], ["forearms"]),
  ex("Dumbbell Curl", "biceps", "dumbbell", ["biceps"], ["forearms"]),
  ex("Incline Dumbbell Curl", "biceps", "dumbbell", ["biceps"], []),
  ex("Incline Hammer Curl", "biceps", "dumbbell", ["biceps"], ["forearms"]),
  ex("Hammer Curl", "biceps", "dumbbell", ["biceps"], ["forearms"]),
  ex("Cable Curl", "biceps", "cable", ["biceps"], []),
  ex("Preacher Curl", "biceps", "machine", ["biceps"], []),
  ex("Concentration Curl", "biceps", "dumbbell", ["biceps"], []),
];

const triceps: Exercise[] = [
  ex("Cable Rope Overhead Triceps Extension", "triceps", "cable", ["triceps"], []),
  ex("Cable Tricep Pushdown", "triceps", "cable", ["triceps"], []),
  ex("Skull Crusher", "triceps", "barbell", ["triceps"], []),
  ex("Dumbbell Overhead Triceps Extension", "triceps", "dumbbell", ["triceps"], []),
  ex("Close-Grip Bench Press", "triceps", "barbell", ["triceps"], ["chest"]),
  ex("Triceps Kickback", "triceps", "dumbbell", ["triceps"], []),
  ex("Bench Dip", "triceps", "bodyweight", ["triceps"], ["chest"]),
];

const forearms: Exercise[] = [
  ex("Barbell Wrist Curl", "forearms", "barbell", ["forearms"], []),
  ex("Reverse Wrist Curl", "forearms", "barbell", ["forearms"], []),
  ex("Farmer's Carry", "forearms", "dumbbell", ["forearms"], ["upperTraps", "abs"]),
  ex("Dead Hang", "forearms", "bodyweight", ["forearms"], ["lats"]),
];

// ---------- Core ----------
const core: Exercise[] = [
  ex("Hanging Leg Raise", "abs", "bodyweight", ["abs"], ["obliques"]),
  ex("Cable Crunch", "abs", "cable", ["abs"], []),
  ex("Plank", "abs", "bodyweight", ["abs"], ["obliques", "lowerBack"], { difficulty: "beginner", tags: ["warmup", "rehab"] }),
  ex("Sit-Up", "abs", "bodyweight", ["abs"], []),
  ex("Ab Wheel Rollout", "abs", "bodyweight", ["abs"], ["lowerBack"]),
  ex("Cable Woodchop", "obliques", "cable", ["obliques"], ["abs"]),
  ex("Russian Twist", "obliques", "bodyweight", ["obliques"], ["abs"]),
  ex("Side Plank", "obliques", "bodyweight", ["obliques"], ["abs"]),
  ex("Kettlebell Swing", "glutes", "kettlebell", ["glutes", "hamstrings"], ["lowerBack", "abs"]),
];

// ---------- Legs ----------
const legs: Exercise[] = [
  ex("Barbell Back Squat", "quads", "barbell", ["quads", "glutes"], ["hamstrings", "lowerBack"], { aliases: ["back squat"], difficulty: "beginner" }),
  ex("Front Squat", "quads", "barbell", ["quads"], ["glutes", "abs"]),
  ex("Leg Press", "quads", "machine", ["quads"], ["glutes", "hamstrings"]),
  ex("Walking Lunge", "quads", "dumbbell", ["quads", "glutes"], ["hamstrings"], { difficulty: "beginner" }),
  ex("Bulgarian Split Squat", "quads", "dumbbell", ["quads", "glutes"], ["hamstrings"]),
  ex("Leg Extension", "quads", "machine", ["quads"], []),
  ex("Hack Squat", "quads", "machine", ["quads"], ["glutes"]),
  ex("Romanian Deadlift", "hamstrings", "barbell", ["hamstrings"], ["glutes", "lowerBack"], { aliases: ["rdl"] }),
  ex("Seated Hamstring Curl", "hamstrings", "machine", ["hamstrings"], []),
  ex("Lying Leg Curl", "hamstrings", "machine", ["hamstrings"], []),
  ex("Hip Thrust", "glutes", "barbell", ["glutes"], ["hamstrings"]),
  ex("Cable Glute Kickback", "glutes", "cable", ["glutes"], []),
  ex("Standing Calf Raise", "calves", "machine", ["calves"], []),
  ex("Seated Calf Raise", "calves", "machine", ["calves"], []),
  ex("Cable Hip Abduction", "abductors", "cable", ["abductors"], ["glutes"]),
  ex("Machine Hip Abduction", "abductors", "machine", ["abductors"], ["glutes"]),
  ex("Cable Hip Adduction", "adductors", "cable", ["adductors"], []),
  ex("Machine Hip Adduction", "adductors", "machine", ["adductors"], []),
  ex("Tibialis Raise", "tibialis", "bodyweight", ["tibialis"], []),
];

// ---------- Cardio ----------
const cardio: Exercise[] = [
  nonStrength("Running (Steady State)", "cardio", { difficulty: "beginner", durationSec: 1200 }),
  nonStrength("Cycling", "cardio", { difficulty: "beginner", durationSec: 1500 }),
  nonStrength("Jump Rope", "cardio", { difficulty: "beginner", durationSec: 300, tags: ["warmup"] }),
  nonStrength("Rowing Machine", "cardio", { difficulty: "intermediate", durationSec: 900 }),
  nonStrength("Stair Climber", "cardio", { difficulty: "intermediate", durationSec: 720 }),
  nonStrength("Swimming (Freestyle)", "cardio", { difficulty: "intermediate", durationSec: 1200 }),
];

// ---------- HIIT ----------
const hiit: Exercise[] = [
  nonStrength("Burpees", "hiit", { difficulty: "intermediate", muscles: ["chest", "quads"], durationSec: 40 }),
  nonStrength("Mountain Climbers", "hiit", { difficulty: "beginner", muscles: ["abs"], durationSec: 30 }),
  nonStrength("Jump Squats", "hiit", { difficulty: "intermediate", muscles: ["quads", "glutes"], durationSec: 30 }),
  nonStrength("Battle Ropes", "hiit", { difficulty: "advanced", muscles: ["forearms"], durationSec: 30 }),
  nonStrength("Box Jumps", "hiit", { difficulty: "advanced", muscles: ["quads", "glutes"], durationSec: 30 }),
  nonStrength("Skater Jumps", "hiit", { difficulty: "intermediate", muscles: ["quads", "abductors"], durationSec: 30 }),
];

// ---------- Calisthenics ----------
const calisthenics: Exercise[] = [
  nonStrength("Pistol Squat", "calisthenics", { difficulty: "advanced", muscles: ["quads", "glutes"] }),
  nonStrength("Muscle-Up", "calisthenics", { difficulty: "advanced", muscles: ["lats", "chest", "triceps"] }),
  nonStrength("Dip (Parallel Bars)", "calisthenics", { difficulty: "intermediate", muscles: ["chest", "triceps"] }),
  nonStrength("L-Sit", "calisthenics", { difficulty: "advanced", muscles: ["abs"], durationSec: 20 }),
  nonStrength("Handstand Hold", "calisthenics", { difficulty: "advanced", muscles: ["frontDelts"], durationSec: 20, tags: ["rehab"] }),
  nonStrength("Australian Row", "calisthenics", { difficulty: "beginner", muscles: ["upperBack", "biceps"] }),
];

// ---------- Mobility ----------
const mobility: Exercise[] = [
  nonStrength("Hip Circles", "mobility", { difficulty: "beginner", muscles: ["abductors"], durationSec: 30, tags: ["warmup", "rehab"] }),
  nonStrength("Thoracic Spine Rotation", "mobility", { difficulty: "beginner", muscles: ["upperBack"], durationSec: 30, tags: ["rehab"] }),
  nonStrength("Ankle Mobility Drill", "mobility", { difficulty: "beginner", muscles: ["tibialis"], durationSec: 30, tags: ["rehab", "warmup"] }),
  nonStrength("90/90 Hip Switch", "mobility", { difficulty: "intermediate", muscles: ["glutes"], durationSec: 40 }),
  nonStrength("Cat-Cow", "mobility", { difficulty: "beginner", muscles: ["lowerBack"], durationSec: 30, tags: ["warmup", "rehab"] }),
  nonStrength("Shoulder Dislocates (Band/Stick)", "mobility", { difficulty: "beginner", muscles: ["frontDelts"], durationSec: 30, tags: ["warmup", "rehab"] }),
];

// ---------- Core / Abs (non-strength additions — the "Core/Abs" category
// itself is a muscle filter over abs+obliques, so this list is additive to
// the strength "abs"/"obliques" entries above, not a replacement for them) ----------
const coreAbsExtra: Exercise[] = [
  nonStrength("Dead Bug", "mobility", { difficulty: "beginner", muscles: ["abs"], tags: ["rehab"] }),
  nonStrength("Bird Dog", "mobility", { difficulty: "beginner", muscles: ["abs", "lowerBack"], tags: ["rehab", "warmup"] }),
  nonStrength("Hollow Body Hold", "calisthenics", { difficulty: "intermediate", muscles: ["abs"], durationSec: 30 }),
  nonStrength("Pallof Press", "calisthenics", { difficulty: "intermediate", muscles: ["obliques"] }),
];

// ---------- Yoga ----------
const yoga: Exercise[] = [
  nonStrength("Downward-Facing Dog", "yoga", { difficulty: "beginner", durationSec: 30, tags: ["warmup"] }),
  nonStrength("Warrior II", "yoga", { difficulty: "beginner", muscles: ["quads"], durationSec: 30 }),
  nonStrength("Child's Pose", "yoga", { difficulty: "beginner", durationSec: 45, tags: ["cooldown", "rehab"] }),
  nonStrength("Sun Salutation (Surya Namaskar)", "yoga", { difficulty: "intermediate", durationSec: 90, tags: ["warmup"] }),
  nonStrength("Pigeon Pose", "yoga", { difficulty: "intermediate", muscles: ["glutes"], durationSec: 45, tags: ["cooldown", "rehab"] }),
  nonStrength("Tree Pose", "yoga", { difficulty: "beginner", durationSec: 30 }),
];

// ---------- Pilates ----------
const pilates: Exercise[] = [
  nonStrength("The Hundred", "pilates", { difficulty: "beginner", muscles: ["abs"], durationSec: 60 }),
  nonStrength("Roll-Up", "pilates", { difficulty: "intermediate", muscles: ["abs"] }),
  nonStrength("Leg Circles", "pilates", { difficulty: "beginner", muscles: ["abs"] }),
  nonStrength("Swan Dive", "pilates", { difficulty: "intermediate", muscles: ["lowerBack"] }),
  nonStrength("Teaser", "pilates", { difficulty: "advanced", muscles: ["abs"] }),
];

// ---------- Stretching ----------
const stretching: Exercise[] = [
  nonStrength("Standing Hamstring Stretch", "stretching", { difficulty: "beginner", muscles: ["hamstrings"], durationSec: 30, tags: ["cooldown"] }),
  nonStrength("Quad Stretch", "stretching", { difficulty: "beginner", muscles: ["quads"], durationSec: 30, tags: ["cooldown"] }),
  nonStrength("Cross-Body Shoulder Stretch", "stretching", { difficulty: "beginner", muscles: ["rearDelts"], durationSec: 30, tags: ["cooldown"] }),
  nonStrength("Doorway Chest Stretch", "stretching", { difficulty: "beginner", muscles: ["chest"], durationSec: 30, tags: ["cooldown"] }),
  nonStrength("Seated Figure-4 Stretch", "stretching", { difficulty: "beginner", muscles: ["glutes"], durationSec: 30, tags: ["cooldown", "rehab"] }),
  nonStrength("Calf Wall Stretch", "stretching", { difficulty: "beginner", muscles: ["calves"], durationSec: 30, tags: ["cooldown"] }),
];

// ---------- Balance ----------
const balance: Exercise[] = [
  nonStrength("Single-Leg Stand", "balance", { difficulty: "beginner", durationSec: 30, tags: ["rehab"] }),
  nonStrength("Bosu Ball Squat", "balance", { difficulty: "intermediate", muscles: ["quads"] }),
  nonStrength("Single-Leg Romanian Deadlift (Bodyweight)", "balance", { difficulty: "intermediate", muscles: ["hamstrings", "glutes"] }),
  nonStrength("Heel-to-Toe Walk", "balance", { difficulty: "beginner", durationSec: 30, tags: ["rehab"] }),

];

export const EXERCISE_LIBRARY: Exercise[] = [
  ...chest,
  ...back,
  ...lats,
  ...shoulders,
  ...biceps,
  ...triceps,
  ...forearms,
  ...core,
  ...legs,
  ...cardio,
  ...hiit,
  ...calisthenics,
  ...mobility,
  ...coreAbsExtra,
  ...yoga,
  ...pilates,
  ...stretching,
  ...balance,
];

export function findExercise(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}
