import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Plus, Trash2, X } from "lucide-react-native";
import { colors } from "../theme/colors";
import Stepper from "./Stepper";
import PrimaryButton from "./PrimaryButton";
import type { RoutineExercise, RoutineSet } from "../types";

interface ExerciseEditSheetProps {
  exerciseName: string | null;
  routineExercise: RoutineExercise | null;
  isLast: boolean;
  onChange: (next: RoutineExercise) => void;
  onRemove: () => void;
  onClose: () => void;
}

function newSet(): RoutineSet {
  return { id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, targetReps: 10, targetWeight: 0, isWarmup: false };
}

export default function ExerciseEditSheet({
  exerciseName,
  routineExercise,
  isLast,
  onChange,
  onRemove,
  onClose,
}: ExerciseEditSheetProps) {
  const visible = routineExercise !== null;
  if (!routineExercise) return null;

  const updateSet = (setId: string, patch: Partial<RoutineSet>) => {
    onChange({
      ...routineExercise,
      sets: routineExercise.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
    });
  };
  const removeSet = (setId: string) => {
    onChange({ ...routineExercise, sets: routineExercise.sets.filter((s) => s.id !== setId) });
  };
  const addSet = () => {
    onChange({ ...routineExercise, sets: [...routineExercise.sets, newSet()] });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-void/70">
        <View className="bg-ink2 border-t border-line rounded-t-3xl p-6 max-h-[85%]">
          <View className="w-10 h-1 rounded-full bg-line self-center mb-5" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-bone font-display text-xl flex-1 mr-3" numberOfLines={1}>
              {exerciseName}
            </Text>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-ink items-center justify-center">
              <X size={16} color={colors.mist} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center justify-between mb-5">
              <Stepper
                label="Rest"
                value={routineExercise.restSec}
                onChange={(v) => onChange({ ...routineExercise, restSec: v })}
                step={15}
                min={0}
                suffix="s"
              />
              {!isLast && (
                <Pressable
                  onPress={() =>
                    onChange({ ...routineExercise, supersetWithNext: !routineExercise.supersetWithNext })
                  }
                  className={`px-3 py-2 rounded-full border ${
                    routineExercise.supersetWithNext ? "bg-plasma border-plasma" : "bg-ink border-line"
                  }`}
                >
                  <Text
                    className={`font-body_semibold text-xs ${
                      routineExercise.supersetWithNext ? "text-void" : "text-mist"
                    }`}
                  >
                    {routineExercise.supersetWithNext ? "Superset with next ✓" : "Superset with next"}
                  </Text>
                </Pressable>
              )}
            </View>

            {routineExercise.sets.map((set, i) => (
              <View key={set.id} className="flex-row items-center bg-ink border border-line rounded-2xl px-3 py-2 mb-2">
                <View className="w-7 h-7 rounded-full bg-ink2 items-center justify-center mr-2">
                  <Text className="text-mist font-mono text-xs">{set.isWarmup ? "W" : i + 1}</Text>
                </View>
                <View className="flex-1 flex-row justify-around">
                  <Stepper
                    value={set.targetWeight}
                    onChange={(v) => updateSet(set.id, { targetWeight: v })}
                    step={2.5}
                    suffix="lb"
                    size="sm"
                  />
                  <Stepper
                    value={set.targetReps}
                    onChange={(v) => updateSet(set.id, { targetReps: v })}
                    step={1}
                    min={1}
                    size="sm"
                  />
                </View>
                <Pressable
                  onPress={() => updateSet(set.id, { isWarmup: !set.isWarmup })}
                  className={`px-2 py-1 rounded-lg mr-2 ${set.isWarmup ? "bg-ember/20" : "bg-ink2"}`}
                >
                  <Text className={`font-body text-[10px] ${set.isWarmup ? "text-ember" : "text-smoke"}`}>W</Text>
                </Pressable>
                <Pressable onPress={() => removeSet(set.id)} hitSlop={6}>
                  <Trash2 size={15} color={colors.smoke} />
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={addSet}
              className="border border-dashed border-line rounded-2xl py-3 items-center flex-row justify-center mb-6"
            >
              <Plus size={14} color={colors.mist} />
              <Text className="text-mist font-body_medium text-xs ml-2">Add set</Text>
            </Pressable>

            <PrimaryButton
              label="Remove Exercise"
              variant="ghost"
              onPress={() => {
                onRemove();
                onClose();
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
