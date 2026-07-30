import type { MuscleGroup } from "../types";

export type ShapeDef =
  | { type: "path"; d: string }
  | { type: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { type: "rect"; x: number; y: number; width: number; height: number; rx: number };

export const BODY_VIEWBOX = { width: 200, height: 440 };

// Decorative, never colored by intensity (head + a neutral neck backdrop are
// drawn once; the actual "neck" muscle region below sits on top of it).
export const BASE_SHAPES_FRONT: ShapeDef[] = [
  { type: "ellipse", cx: 100, cy: 30, rx: 20, ry: 22 },
];
export const BASE_SHAPES_BACK: ShapeDef[] = [
  { type: "ellipse", cx: 100, cy: 30, rx: 20, ry: 22 },
];

// One entry per muscle group per view it appears in. Coordinates were
// prototyped and visually checked (front/back, paint order resolved so
// nothing gets fully hidden — see adductors sitting *after* quads) before
// being carried in here.
export const MUSCLE_SHAPES: Partial<Record<MuscleGroup, { front?: ShapeDef[]; back?: ShapeDef[] }>> = {
  neck: {
    front: [{ type: "rect", x: 90, y: 50, width: 20, height: 14, rx: 5 }],
    back: [{ type: "rect", x: 90, y: 50, width: 20, height: 14, rx: 5 }],
  },
  frontDelts: {
    front: [
      { type: "ellipse", cx: 58, cy: 82, rx: 16, ry: 18 },
      { type: "ellipse", cx: 142, cy: 82, rx: 16, ry: 18 },
    ],
  },
  chest: {
    front: [{ type: "path", d: "M70,72 Q100,64 130,72 L133,128 Q100,140 67,128 Z" }],
  },
  biceps: {
    front: [
      { type: "rect", x: 38, y: 95, width: 20, height: 55, rx: 10 },
      { type: "rect", x: 142, y: 95, width: 20, height: 55, rx: 10 },
    ],
  },
  triceps: {
    back: [
      { type: "rect", x: 38, y: 95, width: 20, height: 55, rx: 10 },
      { type: "rect", x: 142, y: 95, width: 20, height: 55, rx: 10 },
    ],
  },
  forearms: {
    front: [
      { type: "rect", x: 36, y: 152, width: 18, height: 60, rx: 8 },
      { type: "rect", x: 146, y: 152, width: 18, height: 60, rx: 8 },
    ],
    back: [
      { type: "rect", x: 36, y: 152, width: 18, height: 60, rx: 8 },
      { type: "rect", x: 146, y: 152, width: 18, height: 60, rx: 8 },
    ],
  },
  serratus: {
    front: [
      { type: "path", d: "M64,132 L76,140 L72,155 L60,148 Z" },
      { type: "path", d: "M136,132 L124,140 L128,155 L140,148 Z" },
    ],
  },
  abs: {
    front: [{ type: "rect", x: 82, y: 132, width: 36, height: 70, rx: 8 }],
  },
  obliques: {
    front: [
      { type: "path", d: "M66,150 L80,140 L80,200 L70,205 Z" },
      { type: "path", d: "M134,150 L120,140 L120,200 L130,205 Z" },
    ],
  },
  quads: {
    front: [
      { type: "path", d: "M68,210 Q65,260 74,322 L92,322 L90,210 Z" },
      { type: "path", d: "M132,210 Q135,260 126,322 L108,322 L110,210 Z" },
    ],
  },
  adductors: {
    front: [{ type: "rect", x: 89, y: 250, width: 22, height: 76, rx: 9 }],
  },
  tibialis: {
    front: [
      { type: "rect", x: 70, y: 332, width: 22, height: 68, rx: 8 },
      { type: "rect", x: 108, y: 332, width: 22, height: 68, rx: 8 },
    ],
  },
  upperTraps: {
    back: [{ type: "path", d: "M80,64 L120,64 L128,90 L100,82 L72,90 Z" }],
  },
  rearDelts: {
    back: [
      { type: "ellipse", cx: 58, cy: 86, rx: 16, ry: 16 },
      { type: "ellipse", cx: 142, cy: 86, rx: 16, ry: 16 },
    ],
  },
  upperBack: {
    back: [{ type: "path", d: "M84,86 L116,86 L114,140 L86,140 Z" }],
  },
  lats: {
    back: [
      { type: "path", d: "M66,92 L84,88 L82,150 Q70,160 62,145 Z" },
      { type: "path", d: "M134,92 L116,88 L118,150 Q130,160 138,145 Z" },
    ],
  },
  lowerBack: {
    back: [{ type: "rect", x: 84, y: 142, width: 32, height: 45, rx: 8 }],
  },
  glutes: {
    back: [{ type: "path", d: "M70,190 Q100,182 130,190 L128,225 Q100,235 72,225 Z" }],
  },
  hamstrings: {
    back: [
      { type: "path", d: "M68,228 Q65,270 74,320 L96,320 L94,228 Z" },
      { type: "path", d: "M132,228 Q135,270 126,320 L104,320 L106,228 Z" },
    ],
  },
  calves: {
    back: [
      { type: "rect", x: 70, y: 330, width: 22, height: 70, rx: 10 },
      { type: "rect", x: 108, y: 330, width: 22, height: 70, rx: 10 },
    ],
  },
  // Hips are visually folded into the glutes/adductor regions above rather
  // than getting their own shape — abductors highlight by tinting a thin
  // outer strip on the glute region instead of adding new geometry.
  abductors: {
    back: [
      { type: "rect", x: 62, y: 195, width: 12, height: 30, rx: 6 },
      { type: "rect", x: 126, y: 195, width: 12, height: 30, rx: 6 },
    ],
  },
};

// Connective "filler" pieces drawn UNDER the muscle regions so the figure
// reads as one continuous body even where two regions don't perfectly abut
// (e.g. the waist between obliques/abs and quads/adductors).
export const FILLER_SHAPES_FRONT: ShapeDef[] = [
  { type: "rect", x: 84, y: 200, width: 32, height: 14, rx: 4 },
];
export const FILLER_SHAPES_BACK: ShapeDef[] = [
  { type: "rect", x: 84, y: 182, width: 32, height: 10, rx: 4 },
];
