import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search, X } from "lucide-react-native";
import CategoryChip from "../components/CategoryChip";
import ExerciseLibraryRow, { BuildCustomExerciseRow } from "../components/ExerciseLibraryRow";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { useExerciseLibrary } from "../context/AppDataProvider";
import { usePendingSelection } from "../context/PendingSelectionContext";
import { CATEGORY_CHIPS } from "../data/muscles";
import type { Equipment, Exercise, MuscleGroup } from "../types";

const EQUIPMENT_OPTIONS: Equipment[] = ["barbell", "dumbbell", "machine", "cable", "bodyweight", "kettlebell"];

export default function ExercisePickerScreen() {
  const navigation = useNavigation<any>();
  const { library, addCustomExercise } = useExerciseLibrary();
  const { offerExercise } = usePendingSelection();

  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [buildingCustom, setBuildingCustom] = useState(false);

  const filtered = useMemo(() => {
    const chip = CATEGORY_CHIPS.find((c) => c.label === activeChip);
    const q = query.trim().toLowerCase();

    return library.filter((ex) => {
      const matchesChip = !chip?.matches || chip.matches.includes(ex.category);
      if (!matchesChip) return false;
      if (!q) return true;
      return ex.name.toLowerCase().includes(q) || ex.aliases.some((a) => a.toLowerCase().includes(q));
    });
  }, [library, activeChip, query]);

  const selectExercise = (exercise: Exercise) => {
    offerExercise(exercise);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <View className="flex-row items-center justify-between px-6 pb-4">
        <Text className="text-bone font-display_medium text-lg">Add Exercise</Text>
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-ink2 border border-line items-center justify-center">
          <X size={18} color={colors.mist} />
        </Pressable>
      </View>

      {buildingCustom ? (
        <CustomExerciseForm
          onCancel={() => setBuildingCustom(false)}
          onCreate={(input) => {
            const exercise = addCustomExercise(input);
            selectExercise(exercise);
          }}
        />
      ) : (
        <>
          <View className="px-6 mb-3">
            <View className="flex-row items-center bg-ink2 border border-line rounded-2xl px-4 py-3">
              <Search size={16} color={colors.smoke} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search exercises..."
                placeholderTextColor={colors.smoke}
                className="text-bone font-body text-sm flex-1 ml-2"
              />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ paddingHorizontal: 24 }}>
            {CATEGORY_CHIPS.map((c) => (
              <CategoryChip key={c.label} label={c.label} active={activeChip === c.label} onPress={() => setActiveChip(c.label)} />
            ))}
          </ScrollView>

          <View className="px-6 mb-2">
            <BuildCustomExerciseRow onPress={() => setBuildingCustom(true)} />
          </View>

          <View className="px-6 mb-2 flex-row items-center justify-between">
            <Text className="text-smoke font-body text-xs uppercase tracking-wider">From library · {filtered.length}</Text>
          </View>

          <ScrollView style={{ flex: 1 }} className="px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {filtered.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-smoke font-body text-sm">No exercises match that search.</Text>
              </View>
            ) : (
              filtered.map((item) => <ExerciseLibraryRow key={item.id} exercise={item} onPress={() => selectExercise(item)} />)
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function CustomExerciseForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (input: {
    name: string;
    category: MuscleGroup;
    equipment: Equipment;
    primaryMuscles: MuscleGroup[];
    secondaryMuscles: MuscleGroup[];
  }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MuscleGroup>("chest");
  const [equipment, setEquipment] = useState<Equipment>("barbell");

  const canCreate = name.trim().length > 0;
  const categoryOptions = CATEGORY_CHIPS.filter((c) => c.matches).flatMap((c) => c.matches as MuscleGroup[]);
  const uniqueCategories = Array.from(new Set(categoryOptions));

  return (
    <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
      <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-2">Exercise name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Landmine Press"
        placeholderTextColor={colors.smoke}
        className="text-bone font-display text-2xl border-b border-line pb-3 mb-6"
      />

      <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-3">Primary muscle</Text>
      <View className="flex-row flex-wrap mb-6">
        {uniqueCategories.map((m) => (
          <Pressable
            key={m}
            onPress={() => setCategory(m)}
            className={`px-3 py-2 rounded-full mr-2 mb-2 border ${category === m ? "bg-volt border-volt" : "bg-ink2 border-line"}`}
          >
            <Text className={`font-body_medium text-xs ${category === m ? "text-void" : "text-mist"}`}>
              {m.replace(/([A-Z])/g, " $1").trim()}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-3">Equipment</Text>
      <View className="flex-row flex-wrap mb-8">
        {EQUIPMENT_OPTIONS.map((eq) => (
          <Pressable
            key={eq}
            onPress={() => setEquipment(eq)}
            className={`px-3 py-2 rounded-full mr-2 mb-2 border ${equipment === eq ? "bg-plasma border-plasma" : "bg-ink2 border-line"}`}
          >
            <Text className={`font-body_medium text-xs capitalize ${equipment === eq ? "text-void" : "text-mist"}`}>{eq}</Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton
        label="Create & Add"
        variant="volt"
        disabled={!canCreate}
        onPress={() => onCreate({ name: name.trim(), category, equipment, primaryMuscles: [category], secondaryMuscles: [] })}
        className="mb-3"
      />
      <PrimaryButton label="Cancel" variant="ghost" onPress={onCancel} />
    </ScrollView>
  );
}
