import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Alert, Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronRight,
  Dumbbell,
  Flame,
  HelpCircle,
  Ruler,
  Target,
  Timer,
  Trash2,
  Weight,
} from "lucide-react-native";
import Stepper from "../../components/Stepper";
import { colors, gradients } from "../../theme/colors";
import { useHistory, usePersonalization, useSettings } from "../../context/AppDataProvider";
import { computeStreak, isoDay } from "../../utils/dateUtils";
import { storage } from "../../storage/storage";

const LEVEL_LABEL: Record<string, string> = { none: "Not set", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const GOAL_LABEL: Record<string, string> = { strength: "Get Stronger", muscle: "Build Muscle", fatLoss: "Lose Fat", endurance: "Improve Fitness", wellbeing: "Wellbeing" };
const EQUIP_LABEL: Record<string, string> = { fullGym: "Full Gym", homeBasic: "Home", bodyweightOnly: "Bodyweight Only" };

export default function ProfileScreen() {
  const { history } = useHistory();
  const { settings, updateSettings } = useSettings();
  const { profile } = usePersonalization();

  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, [reduceMotion]);

  const streak = computeStreak(history.map((h) => isoDay(new Date(h.date))));
  const totalVolume = history.reduce((sum, h) => sum + h.totalVolume, 0);

  const resetAllData = () => {
    Alert.alert(
      "Reset all data?",
      "This clears every routine, workout, and setting stored on this device. It can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await Promise.all([
              storage.setRoutines([]),
              storage.setHistory([]),
              storage.setCustomExercises([]),
              storage.setAchievementUnlocks([]),
            ]);
            Alert.alert("Done", "Restart the app to see a clean slate.");
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-void" showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={gradients.plasma}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 64, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
      >
        <Text className="text-void font-display text-3xl mb-6">Profile</Text>
        <View className="flex-row">
          <HeaderStat icon={<Flame size={16} color={colors.void} />} value={`${streak}`} label="Day streak" />
          <HeaderStat icon={<Dumbbell size={16} color={colors.void} />} value={`${history.length}`} label="Workouts" />
          <HeaderStat icon={<Weight size={16} color={colors.void} />} value={`${Math.round(totalVolume / 1000)}k`} label="Lb lifted" />
        </View>
      </LinearGradient>

      <Animated.View style={{ opacity, transform: [{ translateY }], paddingHorizontal: 20, marginTop: -20, paddingBottom: 40 }}>
        <View className="bg-ink2 border border-line rounded-2xl px-3 py-1 mb-5">
          <Text className="text-smoke font-body text-xs uppercase tracking-wider ml-2 mt-3 mb-1">Personalization</Text>
          <StaticRow icon={<Target size={16} color={colors.plasma} />} label="Experience" value={LEVEL_LABEL[profile.experienceLevel]} />
          <StaticRow icon={<Dumbbell size={16} color={colors.plasma} />} label="Trains at" value={EQUIP_LABEL[profile.equipment]} />
          <StaticRow icon={<Flame size={16} color={colors.plasma} />} label="Goal" value={GOAL_LABEL[profile.primaryGoal]} isLast />
        </View>

        <View className="bg-ink2 border border-line rounded-2xl px-4 py-4 mb-5">
          <Text className="text-smoke font-body text-xs uppercase tracking-wider mb-3">Preferences</Text>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Timer size={16} color={colors.plasma} />
              <Text className="text-bone font-body_medium text-sm ml-2">Daily goal</Text>
            </View>
            <Stepper
              value={settings.dailyGoalMinutes}
              onChange={(v) => updateSettings({ dailyGoalMinutes: v })}
              step={5}
              min={10}
              suffix=" min"
              size="sm"
              accentColor={colors.plasma}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ruler size={16} color={colors.plasma} />
              <Text className="text-bone font-body_medium text-sm ml-2">Units</Text>
            </View>
            <View className="flex-row bg-ink border border-line rounded-full p-1">
              {(["lb", "kg"] as const).map((u) => (
                <Pressable
                  key={u}
                  onPress={() => updateSettings({ unit: u })}
                  className={`px-3 py-1 rounded-full ${settings.unit === u ? "bg-plasma" : ""}`}
                >
                  <Text className={`font-body_semibold text-xs uppercase ${settings.unit === u ? "text-void" : "text-mist"}`}>{u}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View className="bg-ink2 border border-line rounded-2xl px-3 py-1 mb-5">
          <ActionRow icon={<HelpCircle size={18} color={colors.plasma} />} label="Help & Support" onPress={() => Alert.alert("MAKSH", "Reach out any time — this is a local build, no support backend is wired up yet.")} />
          <ActionRow icon={<Trash2 size={18} color={colors.ember} />} label="Reset all data" onPress={resetAllData} isLast danger />
        </View>

        <View className="items-center pt-2">
          <Text className="text-smoke font-body text-xs">MAKSH · running fully on-device</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function HeaderStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View className="flex-1 items-center">
      {icon}
      <Text className="text-void font-display text-lg mt-1">{value}</Text>
      <Text className="text-void font-body text-[10px] opacity-70 mt-0.5">{label}</Text>
    </View>
  );
}

function StaticRow({ icon, label, value, isLast }: { icon: React.ReactNode; label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between py-3.5 px-2 ${isLast ? "" : "border-b border-line"}`}>
      <View className="flex-row items-center">
        {icon}
        <Text className="text-bone font-body_medium text-sm ml-2.5">{label}</Text>
      </View>
      <Text className="text-mist font-body text-sm">{value}</Text>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
  isLast,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isLast?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between py-3.5 px-2 ${isLast ? "" : "border-b border-line"}`}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className={`font-body_medium text-sm ml-2.5 ${danger ? "text-ember" : "text-bone"}`}>{label}</Text>
      </View>
      <ChevronRight size={16} color={colors.smoke} />
    </Pressable>
  );
}
