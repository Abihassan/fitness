import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ProgressRing from "../../components/ProgressRing";
import BadgeCard from "../../components/BadgeCard";
import BadgeSheet from "../../components/BadgeSheet";
import { colors } from "../../theme/colors";
import { useAchievements } from "../../context/AppDataProvider";
import type { AchievementCategory } from "../../types";
import type { AchievementWithProgress } from "../../utils/achievementEngine";

const TABS: { key: AchievementCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "milestones", label: "Milestones" },
  { key: "volume", label: "Volume" },
  { key: "strength", label: "Strength" },
];

export default function MissionsScreen() {
  const { achievements } = useAchievements();
  const [tab, setTab] = useState<AchievementCategory | "all">("all");
  const [selected, setSelected] = useState<AchievementWithProgress | null>(null);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const pct = achievements.length ? unlockedCount / achievements.length : 0;

  const grouped = useMemo(() => {
    const byCategory = (cat: AchievementCategory) => achievements.filter((a) => a.category === cat);
    if (tab === "all") {
      return [
        { label: "Milestones", items: byCategory("milestones") },
        { label: "Volume", items: byCategory("volume") },
        { label: "Strength", items: byCategory("strength") },
      ];
    }
    return [{ label: TABS.find((t) => t.key === tab)?.label ?? "", items: byCategory(tab) }];
  }, [achievements, tab]);

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <View className="flex-row items-center justify-between px-6 pb-4">
        <Text className="text-bone font-display text-3xl">Missions</Text>
        <Text className="text-smoke font-mono text-xs">
          {unlockedCount}/{achievements.length}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 flex-row items-center mb-6">
          <ProgressRing progress={pct} size={72} strokeWidth={7} gradientId="achRing">
            <Text className="text-bone font-body_semibold text-xs">{Math.round(pct * 100)}%</Text>
          </ProgressRing>
          <View className="ml-4 flex-1">
            <Text className="text-bone font-display text-lg">
              {unlockedCount} of {achievements.length} unlocked
            </Text>
            <Text className="text-mist font-body text-xs mt-1">Keep training to earn more.</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-6" contentContainerStyle={{ paddingRight: 12 }}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full mr-2 border ${
                tab === t.key ? "bg-volt border-volt" : "bg-ink2 border-line"
              }`}
            >
              <Text className={`font-body_semibold text-xs ${tab === t.key ? "text-void" : "text-mist"}`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {grouped.map((group) => (
          <View key={group.label} className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-bone font-display_medium text-lg">{group.label}</Text>
              <Text className="text-smoke font-mono text-xs">
                {group.items.filter((a) => a.unlocked).length}/{group.items.length}
              </Text>
            </View>
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {group.items.map((a) => (
                <View key={a.id} style={{ width: "31%" }}>
                  <BadgeCard achievement={a} onPress={() => setSelected(a)} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <BadgeSheet achievement={selected} onClose={() => setSelected(null)} />
    </View>
  );
}
