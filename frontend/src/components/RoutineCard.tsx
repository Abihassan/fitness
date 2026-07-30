import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Dumbbell, Pencil } from "lucide-react-native";
import { colors, gradients } from "../theme/colors";
import type { Routine } from "../types";

export default function RoutineCard({
  routine,
  onPress,
  onEdit,
}: {
  routine: Routine;
  onPress: () => void;
  onEdit?: () => void;
}) {
  const grad = gradients[routine.mood] ?? gradients.volt;
  const totalSets = routine.exercises.reduce((sum, e) => sum + e.sets.length, 0);

  return (
    <Pressable onPress={onPress} className="w-64 mr-4">
      {({ pressed }) => (
        <View
          className="rounded-3xl border border-line bg-ink2 p-5 h-44 justify-between"
          style={{ transform: [{ scale: pressed ? 0.97 : 1 }] }}
        >
          <View className="flex-row items-center justify-between">
            <LinearGradient
              colors={grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 40, height: 40, borderRadius: 14 }}
              className="items-center justify-center"
            >
              <Dumbbell size={20} color={colors.void} strokeWidth={2.5} />
            </LinearGradient>
            {onEdit ? (
              <Pressable
                onPress={onEdit}
                hitSlop={8}
                className="w-8 h-8 rounded-full bg-ink items-center justify-center"
              >
                <Pencil size={14} color={colors.mist} />
              </Pressable>
            ) : (
              <View className="w-8 h-8 rounded-full bg-ink items-center justify-center">
                <ChevronRight size={16} color={colors.mist} />
              </View>
            )}
          </View>

          <View>
            <Text className="text-bone font-display text-xl mb-1">{routine.name}</Text>
            <Text className="text-mist font-body text-xs">
              {routine.exercises.length} exercises · {totalSets} sets
            </Text>
          </View>

          <Text className="text-smoke font-mono text-xs">
            {routine.exercises.some((e) => e.supersetWithNext) ? "Includes supersets" : "Straight sets"}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
