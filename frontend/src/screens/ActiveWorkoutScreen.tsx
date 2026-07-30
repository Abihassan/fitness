import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Check, ChevronLeft, ChevronRight, Square, X } from "lucide-react-native";
import MuscleMap, { exerciseIntensity } from "../components/MuscleMap";
import Stepper from "../components/Stepper";
import RestTimer from "../components/RestTimer";
import PrimaryButton from "../components/PrimaryButton";
import { colors, gradients } from "../theme/colors";
import { useSession } from "../context/AppDataProvider";
import { formatClock } from "../utils/dateUtils";

export default function ActiveWorkoutScreen() {
  const navigation = useNavigation<any>();
  const { session, updateSet, finishSession, discardSession } = useSession();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [restVisible, setRestVisible] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [, forceTick] = useState(0);

  React.useEffect(() => {
    const iv = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const exercise = session?.exercises[exerciseIndex];
  const grad = gradients[session?.mood ?? "plasma"];

  const totals = useMemo(() => {
    if (!session) return { total: 0, done: 0 };
    let total = 0;
    let done = 0;
    session.exercises.forEach((e) =>
      e.sets.forEach((s) => {
        total += 1;
        if (s.completed) done += 1;
      })
    );
    return { total, done };
  }, [session]);

  const elapsedSec = session ? Math.floor((Date.now() - session.startedAt) / 1000) : 0;

  if (!session || !exercise) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <Text className="text-mist font-body">No active session.</Text>
        <PrimaryButton label="Back" variant="ghost" onPress={() => navigation.goBack()} className="mt-6 mx-10" />
      </View>
    );
  }

  const toggleComplete = (setIndex: number) => {
    const set = exercise.sets[setIndex];
    const willComplete = !set.completed;
    updateSet(exerciseIndex, setIndex, { completed: willComplete });
    if (willComplete) {
      setRestDuration(90);
      setRestVisible(true);
    }
  };

  const goToExercise = (delta: number) => {
    const next = exerciseIndex + delta;
    if (next < 0 || next >= session.exercises.length) return;
    setExerciseIndex(next);
  };

  const confirmQuit = () => {
    Alert.alert("Quit workout?", "Your progress on this session will be lost.", [
      { text: "Keep going", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: () => {
          discardSession();
          navigation.goBack();
        },
      },
    ]);
  };

  const finish = () => {
    finishSession();
    navigation.replace("MainApp", { screen: "Progress" });
  };

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <View className="flex-row items-center justify-between px-6 pb-2">
        <Pressable onPress={confirmQuit} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center">
          <X size={18} color={colors.mist} />
        </Pressable>
        <View className="items-center">
          <Text className="text-mist font-body text-xs uppercase tracking-wider">{session.routineName}</Text>
          <Text className="text-bone font-mono text-base mt-0.5">{formatClock(elapsedSec)}</Text>
        </View>
        <View style={{ backgroundColor: grad[0] }} className="w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-void font-body_semibold text-xs">
            {totals.done}/{totals.total}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-6 mb-1">
        <Pressable onPress={() => goToExercise(-1)} disabled={exerciseIndex === 0} className={exerciseIndex === 0 ? "opacity-30" : ""}>
          <ChevronLeft size={22} color={colors.mist} />
        </Pressable>
        <Text className="text-smoke font-body text-xs">
          Exercise {exerciseIndex + 1} of {session.exercises.length}
        </Text>
        <Pressable
          onPress={() => goToExercise(1)}
          disabled={exerciseIndex === session.exercises.length - 1}
          className={exerciseIndex === session.exercises.length - 1 ? "opacity-30" : ""}
        >
          <ChevronRight size={22} color={colors.mist} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-2 mb-4">
          <Text className="text-bone font-display text-3xl leading-tight">{exercise.name}</Text>
        </View>

        <View className="items-center mb-6">
          <MuscleMap
            intensities={exerciseIntensity(exercise.primaryMuscles, exercise.secondaryMuscles)}
            highlightColor={colors.ember}
            width={110}
          />
        </View>

        <View className="px-6">
          <View className="flex-row px-4 mb-2">
            <Text className="text-smoke font-body text-xs w-8">SET</Text>
            <Text className="text-smoke font-body text-xs flex-1 text-center">WEIGHT</Text>
            <Text className="text-smoke font-body text-xs flex-1 text-center">REPS</Text>
            <Text className="text-smoke font-body text-xs w-9 text-center">✓</Text>
          </View>

          {exercise.sets.map((set, i) => (
            <View
              key={i}
              className={`flex-row items-center py-2 px-3 rounded-2xl mb-2 border ${
                set.completed ? "bg-volt/10 border-volt/30" : "bg-ink2 border-line"
              }`}
            >
              <Text className="text-mist font-mono text-sm w-8">{set.isWarmup ? "W" : i + 1}</Text>
              <View className="flex-1 items-center">
                <Stepper value={set.weight} onChange={(v) => updateSet(exerciseIndex, i, { weight: v })} step={2.5} size="sm" suffix="lb" />
              </View>
              <View className="flex-1 items-center">
                <Stepper value={set.reps} onChange={(v) => updateSet(exerciseIndex, i, { reps: v })} step={1} min={0} size="sm" />
              </View>
              <Pressable
                onPress={() => toggleComplete(i)}
                className={`w-9 h-9 rounded-full items-center justify-center ${set.completed ? "bg-volt" : "bg-ink border border-line"}`}
              >
                <Check size={16} color={set.completed ? colors.void : colors.smoke} strokeWidth={3} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pb-2">
        {exerciseIndex === session.exercises.length - 1 ? (
          <PrimaryButton label="Finish Workout" variant="volt" icon={<Square size={16} color={colors.void} fill={colors.void} />} onPress={finish} />
        ) : (
          <PrimaryButton label="Next Exercise" variant="plasma" icon={<ChevronRight size={18} color={colors.void} />} onPress={() => goToExercise(1)} />
        )}
      </View>

      <RestTimer visible={restVisible} durationSec={restDuration} onClose={() => setRestVisible(false)} />
    </View>
  );
}
