import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { colors } from "../theme/colors";
import { resolveBadgeIcon } from "./BadgeCard";
import type { AchievementWithProgress } from "../utils/achievementEngine";

export default function BadgeSheet({
  achievement,
  onClose,
}: {
  achievement: AchievementWithProgress | null;
  onClose: () => void;
}) {
  const visible = achievement !== null;
  const Icon = achievement ? resolveBadgeIcon(achievement.icon) : null;
  const progressRatio = achievement
    ? Math.min(1, achievement.progressValue / achievement.criteria.threshold)
    : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-ink2 border-t border-line rounded-t-3xl p-6 pb-10">
              <View className="w-10 h-1 rounded-full bg-line self-center mb-6" />

              {achievement && Icon && (
                <>
                  <View className="flex-row items-center justify-between mb-4">
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center ${
                        achievement.unlocked ? "bg-volt" : "bg-ink"
                      }`}
                    >
                      <Icon size={26} color={achievement.unlocked ? colors.void : colors.smoke} />
                    </View>
                    <Pressable
                      onPress={onClose}
                      className="w-9 h-9 rounded-full bg-ink items-center justify-center"
                    >
                      <X size={16} color={colors.mist} />
                    </Pressable>
                  </View>

                  <Text className="text-bone font-display text-2xl mb-1">{achievement.name}</Text>
                  <Text className="text-mist font-body text-sm mb-5">{achievement.description}</Text>

                  <View className="h-2 rounded-full bg-ink overflow-hidden mb-2">
                    <View
                      className="h-2 rounded-full bg-volt"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </View>
                  <Text className="text-smoke font-mono text-xs">
                    {Math.min(achievement.progressValue, achievement.criteria.threshold).toLocaleString()} / {achievement.criteria.threshold.toLocaleString()}
                  </Text>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <Text className="text-volt font-body_medium text-xs mt-4">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  )}
                </>
              )}
            </View>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}
