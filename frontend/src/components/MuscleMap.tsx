import React from "react";
import { View, Text } from "react-native";
import Svg, { Ellipse, Path, Rect } from "react-native-svg";
import {
  BASE_SHAPES_BACK,
  BASE_SHAPES_FRONT,
  BODY_VIEWBOX,
  FILLER_SHAPES_BACK,
  FILLER_SHAPES_FRONT,
  MUSCLE_SHAPES,
  type ShapeDef,
} from "./muscleMapShapes";
import type { MuscleGroup } from "../types";
import { colors, mixHexColors } from "../theme/colors";

interface MuscleMapProps {
  /** 0..1 activation per muscle group. Omitted groups render neutral. */
  intensities: Partial<Record<MuscleGroup, number>>;
  /** Color the heat interpolates toward at intensity 1. */
  highlightColor?: string;
  /** Overall render width; height follows the 200:440 body aspect ratio. */
  width?: number;
  /** Show "Front" / "Back" captions under each silhouette. */
  showLabels?: boolean;
}

const NEUTRAL = colors.line;
const DECORATIVE = "#3A3A42"; // head — never colorable, sits slightly lighter than line

function renderShape(shape: ShapeDef, fill: string, key: string) {
  if (shape.type === "path") return <Path key={key} d={shape.d} fill={fill} />;
  if (shape.type === "ellipse")
    return <Ellipse key={key} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={fill} />;
  return (
    <Rect key={key} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} fill={fill} />
  );
}

function Body({
  view,
  intensities,
  highlightColor,
  width,
}: {
  view: "front" | "back";
  intensities: Partial<Record<MuscleGroup, number>>;
  highlightColor: string;
  width: number;
}) {
  const height = width * (BODY_VIEWBOX.height / BODY_VIEWBOX.width);
  const base = view === "front" ? BASE_SHAPES_FRONT : BASE_SHAPES_BACK;
  const filler = view === "front" ? FILLER_SHAPES_FRONT : FILLER_SHAPES_BACK;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${BODY_VIEWBOX.width} ${BODY_VIEWBOX.height}`}>
      {base.map((s, i) => renderShape(s, DECORATIVE, `base-${i}`))}
      {filler.map((s, i) => renderShape(s, NEUTRAL, `fill-${i}`))}
      {(Object.keys(MUSCLE_SHAPES) as MuscleGroup[]).map((muscle) => {
        const shapes = MUSCLE_SHAPES[muscle]?.[view];
        if (!shapes) return null;
        const t = intensities[muscle] ?? 0;
        const fill = t > 0 ? mixHexColors(NEUTRAL, highlightColor, Math.max(0.22, t)) : NEUTRAL;
        return shapes.map((s, i) => renderShape(s, fill, `${muscle}-${i}`));
      })}
    </Svg>
  );
}

export default function MuscleMap({
  intensities,
  highlightColor = colors.ember,
  width = 130,
  showLabels = false,
}: MuscleMapProps) {
  return (
    <View className="flex-row items-start justify-center">
      <View className="items-center mr-3">
        <Body view="front" intensities={intensities} highlightColor={highlightColor} width={width} />
        {showLabels && <Text className="text-smoke font-body text-[10px] mt-1">Front</Text>}
      </View>
      <View className="items-center ml-3">
        <Body view="back" intensities={intensities} highlightColor={highlightColor} width={width} />
        {showLabels && <Text className="text-smoke font-body text-[10px] mt-1">Back</Text>}
      </View>
    </View>
  );
}

/** Convenience: build an intensities map giving every listed muscle full (1)
 * activation — handy for "which muscles did this exercise/session hit"
 * views where you don't have a graded weighting, just a set of names. */
export function fullIntensity(muscles: MuscleGroup[]): Partial<Record<MuscleGroup, number>> {
  return muscles.reduce((acc, m) => ({ ...acc, [m]: 1 }), {} as Partial<Record<MuscleGroup, number>>);
}

/** Convenience: primary movers at full intensity, secondary/assisting
 * muscles at half — the shape Active Workout Logging wants for "this
 * exercise" and Insights wants for a lighter secondary-muscle read. */
export function exerciseIntensity(
  primaryMuscles: MuscleGroup[],
  secondaryMuscles: MuscleGroup[] = []
): Partial<Record<MuscleGroup, number>> {
  const map: Partial<Record<MuscleGroup, number>> = {};
  secondaryMuscles.forEach((m) => (map[m] = 0.5));
  primaryMuscles.forEach((m) => (map[m] = 1));
  return map;
}
