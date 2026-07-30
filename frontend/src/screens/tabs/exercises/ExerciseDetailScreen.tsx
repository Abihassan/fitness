import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeft, Heart } from "lucide-react-native";
import MuscleMap, { exerciseIntensity } from "../../../components/MuscleMap";
import { colors } from "../../../theme/colors";
import { useExerciseLibrary } from "../../../context/AppDataProvider";
import { muscleLabel } from "../../../data/muscles";

export default function ExerciseDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { exerciseId } = route.params;
  const { library, favoriteIds, toggleFavorite } = useExerciseLibrary();

  const exercise = library.find((e) => e.id === exerciseId);
  const isFavorite = favoriteIds.includes(exerciseId);

  if (!exercise) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <Text className="text-mist font-body">Exercise not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-void" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View className="flex-row items-center justify-between mb-6">
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center">
          <ChevronLeft size={18} color={colors.mist} />
        </Pressable>
        <Pressable
          onPress={() => toggleFavorite(exercise.id)}
          className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center"
        >
          <Heart size={18} color={isFavorite ? colors.ember : colors.mist} fill={isFavorite ? colors.ember : "none"} />
        </Pressable>
      </View>

      <Text className="text-bone font-display text-3xl mb-2">{exercise.name}</Text>
      <View className="flex-row flex-wrap mb-6" style={{ gap: 6 }}>
        <Tag label={exercise.discipline} />
        <Tag label={exercise.difficulty} />
        <Tag label={exercise.equipment} />
        {exercise.durationSec ? <Tag label={`${exercise.durationSec}s`} /> : null}
      </View>

      <View className="items-center bg-ink2 border border-line rounded-3xl p-5 mb-6">
        <MuscleMap
          intensities={exerciseIntensity(exercise.primaryMuscles, exercise.secondaryMuscles)}
          highlightColor={colors.ember}
          width={130}
          showLabels
        />
      </View>

      {exercise.primaryMuscles.length > 0 && (
        <View className="mb-6">
          <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-2">Primary muscles</Text>
          <View className="flex-row flex-wrap" style={{ gap: 6 }}>
            {exercise.primaryMuscles.map((m) => (
              <Tag key={m} label={muscleLabel(m)} accent />
            ))}
          </View>
        </View>
      )}

      {exercise.secondaryMuscles.length > 0 && (
        <View>
          <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-2">Secondary muscles</Text>
          <View className="flex-row flex-wrap" style={{ gap: 6 }}>
            {exercise.secondaryMuscles.map((m) => (
              <Tag key={m} label={muscleLabel(m)} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function Tag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <View className={`px-3 py-1.5 rounded-full border ${accent ? "bg-ember/15 border-ember/40" : "bg-ink border-line"}`}>
      <Text className={`font-body_medium text-xs capitalize ${accent ? "text-ember" : "text-mist"}`}>{label}</Text>
    </View>
  );
}
