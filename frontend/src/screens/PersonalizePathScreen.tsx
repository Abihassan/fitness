import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dumbbell, Heart, Home as HomeIcon, PersonStanding, Target, Zap } from "lucide-react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { usePersonalization } from "../context/AppDataProvider";
import type { PersonalizationProfile } from "../types";

type Level = PersonalizationProfile["experienceLevel"];
type Equip = PersonalizationProfile["equipment"];
type Goal = PersonalizationProfile["primaryGoal"];

function OptionRow({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center py-3 px-4 rounded-2xl mb-2.5 border ${
        selected ? "bg-volt border-volt" : "bg-ink border-line"
      }`}
    >
      <View className="mr-2.5">{icon}</View>
      <Text className={`font-body_semibold text-base ${selected ? "text-void" : "text-bone"}`}>{label}</Text>
    </Pressable>
  );
}

export default function PersonalizePathScreen() {
  const navigation = useNavigation<any>();
  const { profile, updateProfile } = usePersonalization();

  const [level, setLevel] = useState<Level>(profile.experienceLevel === "none" ? "beginner" : profile.experienceLevel);
  const [equipment, setEquipment] = useState<Equip>(profile.equipment);
  const [goal, setGoal] = useState<Goal>(profile.primaryGoal);

  const iconColor = (selected: boolean) => (selected ? colors.void : colors.plasma);

  const finish = () => {
    updateProfile({
      experienceLevel: level,
      equipment,
      primaryGoal: goal,
      daysPerWeek: level === "beginner" ? 3 : level === "intermediate" ? 4 : 5,
      completedAt: new Date().toISOString(),
    });
    navigation.replace("MainApp");
  };

  return (
    <ScrollView className="flex-1 bg-void" contentContainerStyle={{ padding: 24, paddingTop: 64, paddingBottom: 40 }}>
      <Text className="text-bone font-display text-3xl text-center mb-8">Personalize Your Path</Text>

      <View className="bg-ink2 border border-line rounded-3xl p-4 mb-5">
        <Text className="text-bone font-body_semibold text-base mb-3">Experience level</Text>
        <OptionRow label="Beginner" selected={level === "beginner"} onPress={() => setLevel("beginner")} icon={<PersonStanding size={18} color={iconColor(level === "beginner")} />} />
        <OptionRow label="Intermediate" selected={level === "intermediate"} onPress={() => setLevel("intermediate")} icon={<Zap size={18} color={iconColor(level === "intermediate")} />} />
        <OptionRow label="Advanced" selected={level === "advanced"} onPress={() => setLevel("advanced")} icon={<Dumbbell size={18} color={iconColor(level === "advanced")} />} />
      </View>

      <View className="bg-ink2 border border-line rounded-3xl p-4 mb-5">
        <Text className="text-bone font-body_semibold text-base mb-3">Where you train</Text>
        <OptionRow label="Home" selected={equipment === "homeBasic"} onPress={() => setEquipment("homeBasic")} icon={<HomeIcon size={18} color={iconColor(equipment === "homeBasic")} />} />
        <OptionRow label="Full Gym" selected={equipment === "fullGym"} onPress={() => setEquipment("fullGym")} icon={<Dumbbell size={18} color={iconColor(equipment === "fullGym")} />} />
        <OptionRow label="Bodyweight Only" selected={equipment === "bodyweightOnly"} onPress={() => setEquipment("bodyweightOnly")} icon={<PersonStanding size={18} color={iconColor(equipment === "bodyweightOnly")} />} />
      </View>

      <View className="bg-ink2 border border-line rounded-3xl p-4 mb-8">
        <Text className="text-bone font-body_semibold text-base mb-3">Primary goal</Text>
        <OptionRow label="Get Stronger" selected={goal === "strength"} onPress={() => setGoal("strength")} icon={<Dumbbell size={18} color={iconColor(goal === "strength")} />} />
        <OptionRow label="Build Muscle" selected={goal === "muscle"} onPress={() => setGoal("muscle")} icon={<Target size={18} color={iconColor(goal === "muscle")} />} />
        <OptionRow label="Improve Fitness" selected={goal === "endurance"} onPress={() => setGoal("endurance")} icon={<Heart size={18} color={iconColor(goal === "endurance")} />} />
      </View>

      <PrimaryButton
        label="Continue"
        variant="volt"
        onPress={finish}
        className="w-full"
      />

    </ScrollView>
  );
}
