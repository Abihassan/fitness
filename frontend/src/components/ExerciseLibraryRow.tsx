import React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Plus } from "lucide-react-native";
import type { Exercise } from "../types";
import { colors, gradients } from "../theme/colors";

// Tiny abstract glyph rather than a literal muscle icon set — a colored
// ring keyed by equipment type, cheap to render at FlashList scale and
// legible at 36px.
const EQUIPMENT_TINT: Record<Exercise["equipment"], string> = {
  barbell: colors.volt,
  dumbbell: colors.plasma,
  machine: colors.ember,
  cable: colors.plasma,
  bodyweight: colors.volt,
  kettlebell: colors.ember,
};

function EquipmentGlyph({ equipment }: { equipment: Exercise["equipment"] }) {
  const tint = EQUIPMENT_TINT[equipment];
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36">
      <Circle cx={18} cy={18} r={16} stroke={tint} strokeWidth={2.5} fill={colors.ink2} />
      <Circle cx={18} cy={18} r={7} fill={tint} opacity={0.85} />
    </Svg>
  );
}

export default function ExerciseLibraryRow({
  exercise,
  onPress,
}: {
  exercise: Exercise;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-ink2 border border-line rounded-2xl px-3 py-3 mb-2"
    >
      <EquipmentGlyph equipment={exercise.equipment} />
      <View className="flex-1 ml-3">
        <Text className="text-bone font-body_semibold text-sm">{exercise.name}</Text>
        <Text className="text-smoke font-body text-xs mt-0.5 capitalize">
          {exercise.category.replace(/([A-Z])/g, " $1").trim()} · {exercise.equipment}
        </Text>
      </View>
      <View className="w-8 h-8 rounded-full bg-ink items-center justify-center">
        <Plus size={16} color={colors.bone} />
      </View>
    </Pressable>
  );
}

export function BuildCustomExerciseRow({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-ink2 border border-dashed border-line rounded-2xl px-3 py-3 mb-2"
    >
      <View
        style={{ backgroundColor: gradients.plasma[0] }}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        <Plus size={18} color={colors.void} strokeWidth={2.5} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-bone font-body_semibold text-sm">Build Custom Exercise</Text>
        <Text className="text-smoke font-body text-xs mt-0.5">Name it yourself and pick the details</Text>
      </View>
    </Pressable>
  );
}
