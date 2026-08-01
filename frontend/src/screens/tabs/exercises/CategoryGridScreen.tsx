import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "lucide-react-native";
import { colors } from "../../../theme/colors";
import { CATEGORIES } from "../../../data/categories";
import { useExerciseLibrary } from "../../../context/AppDataProvider";
import ExerciseLibraryRow from "../../../components/ExerciseLibraryRow";

export default function CategoryGridScreen() {
  const navigation = useNavigation<any>();
  const { library } = useExerciseLibrary();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return library
      .filter((ex) => ex.name.toLowerCase().includes(q) || ex.aliases.some((a) => a.toLowerCase().includes(q)))
      .slice(0, 20);
  }, [library, query]);

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <View className="px-6 pb-4">
        <Text className="text-bone font-display text-3xl mb-4">Exercises</Text>
        <View className="flex-row items-center bg-ink2 border border-line rounded-2xl px-4 py-3">
          <Search size={16} color={colors.smoke} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search all exercises..."
            placeholderTextColor={colors.smoke}
            className="text-bone font-body text-sm flex-1 ml-2"
          />
        </View>
      </View>

      {query.trim().length > 0 ? (
        <ScrollView className="px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {searchResults.length === 0 ? (
            <Text className="text-smoke font-body text-sm text-center mt-10">No exercises match "{query}".</Text>
          ) : (
            searchResults.map((ex) => (
              <ExerciseLibraryRow key={ex.id} exercise={ex} onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: ex.id })} />
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                onPress={() =>
                  navigation.navigate("CategoryDetail", {
                    categoryKey: cat.key,
                    label: cat.label,
                    filter: cat.filter,
                  })
                }
                style={{ width: "48%" }}
                className="bg-ink2 border border-line rounded-3xl py-6 items-center mb-4"
              >
                <View className="w-16 h-16 rounded-2xl bg-ink items-center justify-center mb-3">
                  <Image
                    source={cat.icon}
                    style={{ width: 36, height: 36 }}
                    resizeMode="contain"
                  />
                </View>

                <Text className="text-bone font-body_semibold text-sm text-center px-2">
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>

        </ScrollView>
      )}
    </View>
  );
}
