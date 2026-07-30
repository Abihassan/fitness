export interface WarmupExercise {
  id: string;
  name: string;
  durationSec: number;
}

export const WARMUP_EXERCISES: WarmupExercise[] = [
  { id: "wu-1", name: "Arm Circles", durationSec: 30 },
  { id: "wu-2", name: "Band Pass-Through", durationSec: 30 },
  { id: "wu-3", name: "Scapular Wall Slide", durationSec: 30 },
  { id: "wu-4", name: "Bodyweight Squat", durationSec: 45 },
  { id: "wu-5", name: "World's Greatest Stretch", durationSec: 40 },
];
