import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  Award,
  BarChart3,
  Crown,
  Flame,
  Layers,
  Lock,
  Medal,
  RotateCw,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Weight,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { colors } from "../theme/colors";
import type { AchievementWithProgress } from "../utils/achievementEngine";

const ICONS: Record<string, LucideIcon> = {
  Target,
  Flame,
  Trophy,
  Award,
  Swords,
  Zap,
  Layers,
  BarChart3,
  Crown,
  RotateCw,
  Weight,
  TrendingUp,
  Medal,
};

export function resolveBadgeIcon(name: string): LucideIcon {
  return ICONS[name] ?? Trophy;
}

function formatThreshold(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function BadgeCard({
  achievement,
  onPress,
}: {
  achievement: AchievementWithProgress;
  onPress: () => void;
}) {
  const Icon = resolveBadgeIcon(achievement.icon);
  const { unlocked, progressValue, criteria } = achievement;
  const clampedProgress = Math.min(progressValue, criteria.threshold);

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-2xl p-3 border ${
        unlocked ? "bg-ink2 border-volt" : "bg-ink2 border-line"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
          unlocked ? "bg-volt" : "bg-ink"
        }`}
      >
        <Icon size={20} color={unlocked ? colors.void : colors.smoke} />
      </View>
      <Text
        numberOfLines={1}
        className={`font-body_semibold text-xs text-center ${unlocked ? "text-bone" : "text-smoke"}`}
      >
        {achievement.name}
      </Text>
      <Text className="font-mono text-[10px] text-smoke mt-1">
        {formatThreshold(clampedProgress)}/{formatThreshold(criteria.threshold)}
      </Text>

      {!unlocked && (
        <View className="absolute inset-0 items-center justify-center bg-void/55 rounded-2xl">
          <Lock size={18} color={colors.smoke} />
        </View>
      )}
    </Pressable>
  );
}
