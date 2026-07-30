import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from "lucide-react-native";
import DraggableList from "../components/DraggableList";
import ExerciseEditSheet from "../components/ExerciseEditSheet";
import PrimaryButton from "../components/PrimaryButton";
import { colors, gradients } from "../theme/colors";
import { useRoutines, useExerciseLibrary } from "../context/AppDataProvider";
import { usePendingSelection } from "../context/PendingSelectionContext";
import { STARTER_ROUTINES } from "../data/routineTemplates";
import type { Mood, Routine, RoutineExercise } from "../types";

const MOODS: Mood[] = ["volt", "plasma", "ember"];
const ROW_HEIGHT = 76;

function regenerateIds(exercises: RoutineExercise[]): RoutineExercise[] {
  return exercises.map((e, i) => ({
    ...e,
    id: `rex-${Date.now()}-${i}`,
    order: i,
    sets: e.sets.map((s, j) => ({ ...s, id: `set-${Date.now()}-${i}-${j}` })),
  }));
}

export default function RoutineEditorScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { routineId: id } = route.params ?? { routineId: "new" };
  const isNew = id === "new";
  const { getRoutine, upsertRoutine, deleteRoutine } = useRoutines();
  const { library } = useExerciseLibrary();
  const { pendingExercise, clearPendingExercise } = usePendingSelection();

  const existing = !isNew ? getRoutine(id) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [mood, setMood] = useState<Mood>(existing?.mood ?? "volt");
  const [exercises, setExercises] = useState<RoutineExercise[]>(existing?.exercises ?? []);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const showTemplatePicker = isNew && exercises.length === 0;

  useEffect(() => {
    if (!pendingExercise) return;
    const rex: RoutineExercise = {
      id: `rex-${Date.now()}`,
      exerciseId: pendingExercise.id,
      order: exercises.length,
      supersetWithNext: false,
      restSec: 90,
      sets: [{ id: `set-${Date.now()}`, targetReps: 10, targetWeight: 0, isWarmup: false }],
    };
    setExercises((prev) => [...prev, rex]);
    clearPendingExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingExercise, clearPendingExercise]);

  const applyTemplate = (template: Routine) => {
    setName(template.name);
    setMood(template.mood);
    setExercises(regenerateIds(template.exercises));
  };

  const editingExercise = exercises.find((e) => e.id === editingExerciseId) ?? null;
  const editingExerciseIndex = exercises.findIndex((e) => e.id === editingExerciseId);
  const editingExerciseName = editingExercise
    ? library.find((l) => l.id === editingExercise.exerciseId)?.name ?? "Exercise"
    : null;

  const updateExercise = (next: RoutineExercise) => {
    setExercises((prev) => prev.map((e) => (e.id === next.id ? next : e)));
  };
  const removeExercise = (exId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exId));
  };

  const canSave = name.trim().length > 0 && exercises.length > 0;

  const save = () => {
    if (!canSave) {
      Alert.alert("Almost there", "Give your routine a name and at least one exercise.");
      return;
    }
    const now = new Date().toISOString();
    const routine: Routine = {
      id: isNew ? `routine-${Date.now()}` : id,
      name: name.trim(),
      mood,
      exercises: exercises.map((e, i) => ({ ...e, order: i })),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    upsertRoutine(routine);
    navigation.goBack();
  };

  const remove = () => {
    Alert.alert("Delete routine?", `"${name}" will be removed permanently.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteRoutine(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center">
            <X size={18} color={colors.mist} />
          </Pressable>
          <Text className="text-bone font-display_medium text-lg">{isNew ? "New Routine" : "Edit Routine"}</Text>
          {!isNew ? (
            <Pressable onPress={remove} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center">
              <Trash2 size={16} color={colors.ember} />
            </Pressable>
          ) : (
            <View className="w-10" />
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-2">Routine name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Push Day"
              placeholderTextColor={colors.smoke}
              className="text-bone font-display text-2xl border-b border-line pb-3"
            />

            <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-3 mt-6">Accent</Text>
            <View className="flex-row mb-6">
              {MOODS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMood(m)}
                  style={{ backgroundColor: gradients[m][0] }}
                  className={`w-11 h-11 rounded-full mr-3 items-center justify-center ${mood === m ? "border-2 border-bone" : ""}`}
                />
              ))}
            </View>

            {showTemplatePicker && (
              <View className="mb-6">
                <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-3">Start from a template</Text>
                {STARTER_ROUTINES.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => applyTemplate(t)}
                    className="flex-row items-center justify-between bg-ink2 border border-line rounded-2xl px-4 py-3 mb-2"
                  >
                    <View>
                      <Text className="text-bone font-body_semibold text-sm">{t.name}</Text>
                      <Text className="text-smoke font-body text-xs mt-0.5">{t.exercises.length} exercises</Text>
                    </View>
                    <View style={{ backgroundColor: gradients[t.mood][0] }} className="w-3 h-3 rounded-full" />
                  </Pressable>
                ))}
              </View>
            )}

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-bone font-display_medium text-lg">Exercises</Text>
              <Pressable
                onPress={() => navigation.navigate("ExercisePicker")}
                className="flex-row items-center bg-ink2 border border-line px-3 py-2 rounded-full"
              >
                <Plus size={14} color={colors.bone} />
                <Text className="text-bone font-body_medium text-xs ml-1.5">Add</Text>
              </Pressable>
            </View>

            {exercises.length === 0 ? (
              <View className="bg-ink2 border border-dashed border-line rounded-2xl py-8 items-center">
                <Text className="text-smoke font-body text-sm">No exercises yet. Tap Add to build your flow.</Text>
              </View>
            ) : (
              <DraggableList
                data={exercises}
                keyExtractor={(e) => e.id}
                rowHeight={ROW_HEIGHT}
                onReorder={setExercises}
                renderItem={(rex) => {
                  const exerciseName = library.find((l) => l.id === rex.exerciseId)?.name ?? "Unknown Exercise";
                  return (
                    <Pressable
                      onPress={() => setEditingExerciseId(rex.id)}
                      style={{ height: ROW_HEIGHT - 8 }}
                      className="bg-ink2 border border-line rounded-2xl px-4 justify-center mb-2"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 mr-2">
                          <Text numberOfLines={1} className="text-bone font-body_semibold text-sm">
                            {exerciseName}
                          </Text>
                          <Text className="text-smoke font-body text-xs mt-1">
                            {rex.sets.length} sets · {rex.sets[0]?.targetReps ?? 0} reps · {rex.restSec}s rest
                            {rex.supersetWithNext ? " · superset" : ""}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        </ScrollView>

        <View className="px-6 pb-2">
          <PrimaryButton label="Save Routine" variant="volt" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>

      <ExerciseEditSheet
        exerciseName={editingExerciseName}
        routineExercise={editingExercise}
        isLast={editingExerciseIndex === exercises.length - 1}
        onChange={updateExercise}
        onRemove={() => editingExercise && removeExercise(editingExercise.id)}
        onClose={() => setEditingExerciseId(null)}
      />
    </View>
  );
}
