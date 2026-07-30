import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ExerciseLibraryRow from "../../../components/ExerciseLibraryRow";
import { colors } from "../../../theme/colors";
import { useExerciseLibrary, useSettings } from "../../../context/AppDataProvider";
import { matchesFilter } from "../../../data/categories";
import { CHALLENGES } from "../../../data/challenges";

export default function CategoryDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { label, filter } = route.params;
  const { library } = useExerciseLibrary();
  const { settings } = useSettings();

  const items = useMemo(() => {
    if (filter.kind === "challenges") return [];
    return library.filter((ex) => matchesFilter(ex, filter, settings.favoriteExerciseIds));
  }, [library, filter, settings.favoriteExerciseIds]);

  if (filter.kind === "challenges") {
    return (
      <ScrollView className="flex-1 bg-void" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <Text className="text-bone font-display text-2xl mb-1">{label}</Text>
        <Text className="text-mist font-body text-sm mb-6">Short, curated multi-exercise sets.</Text>
        {CHALLENGES.map((c) => (
          <Pressable
            key={c.id}
            className="bg-ink2 border border-line rounded-3xl p-5 mb-3"
            onPress={() => navigation.navigate("ChallengeDetail", { challengeId: c.id })}
          >
            <Text className="text-bone font-display text-xl mb-1">{c.name}</Text>
            <Text className="text-mist font-body text-sm mb-3">{c.description}</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-smoke font-mono text-xs">{c.exerciseIds.length} exercises</Text>
              <Text className="text-volt font-body_semibold text-xs">{c.durationLabel}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-void">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text className="text-bone font-display text-2xl mb-1">{label}</Text>
        <Text className="text-mist font-body text-sm mb-6">
          {items.length} exercise{items.length === 1 ? "" : "s"}
        </Text>
        {items.length === 0 ? (
          <View className="bg-ink2 border border-dashed border-line rounded-3xl py-10 items-center">
            <Text className="text-smoke font-body text-sm text-center px-6">
              {filter.kind === "favorites"
                ? "Star exercises from their detail page to collect them here."
                : "Nothing in this category yet."}
            </Text>
          </View>
        ) : (
          items.map((ex) => (
            <ExerciseLibraryRow key={ex.id} exercise={ex} onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: ex.id })} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
