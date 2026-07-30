import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import ExerciseLibraryRow from "../../../components/ExerciseLibraryRow";
import { colors } from "../../../theme/colors";
import { useExerciseLibrary } from "../../../context/AppDataProvider";
import { CHALLENGES } from "../../../data/challenges";

export default function ChallengeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { challengeId } = route.params;
  const { library } = useExerciseLibrary();

  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <Text className="text-mist font-body">Challenge not found.</Text>
      </View>
    );
  }

  const exercises = challenge.exerciseIds
    .map((id) => library.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <ScrollView className="flex-1 bg-void" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center mb-6">
        <ChevronLeft size={18} color={colors.mist} />
      </Pressable>

      <Text className="text-bone font-display text-3xl mb-2">{challenge.name}</Text>
      <Text className="text-mist font-body text-sm mb-1">{challenge.description}</Text>
      <Text className="text-volt font-body_semibold text-xs mb-6">{challenge.durationLabel}</Text>

      {exercises.map((ex) => (
        <ExerciseLibraryRow key={ex.id} exercise={ex} onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: ex.id })} />
      ))}
    </ScrollView>
  );
}
