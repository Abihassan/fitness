import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Award, ChevronDown, ChevronUp, Flame, LineChart, Play, Plus } from "lucide-react-native";
import ProgressRing from "../../components/ProgressRing";
import RoutineCard from "../../components/RoutineCard";
import PrimaryButton from "../../components/PrimaryButton";
import WeekStrip from "../../components/WeekStrip";
import WarmupRow from "../../components/WarmupRow";
import { colors } from "../../theme/colors";
import { greetingForHour, currentWeekDays, isoDay, computeStreak } from "../../utils/dateUtils";
import { volumeInLastNDays } from "../../utils/volumeCalc";
import { useRoutines, useHistory, useSession, useSettings } from "../../context/AppDataProvider";
import { WARMUP_EXERCISES } from "../../data/warmups";
import type { Routine } from "../../types";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { routines } = useRoutines();
  const { history } = useHistory();
  const { startSession } = useSession();
  const { settings } = useSettings();
  const [warmupOpen, setWarmupOpen] = useState(false);

  const todayIso = isoDay();
  const minutesToday = Math.round(
    history
      .filter((w) => isoDay(new Date(w.date)) === todayIso)
      .reduce((sum, w) => sum + w.durationSec, 0) / 60
  );
  const progress = settings.dailyGoalMinutes > 0 ? minutesToday / settings.dailyGoalMinutes : 0;
  const historyIsoDates = history.map((w) => isoDay(new Date(w.date)));
  const weekDays = currentWeekDays(historyIsoDates);
  const streak = computeStreak(historyIsoDates);
  const weeklyVolume = volumeInLastNDays(history, 7);
  const lastWorkout = history[0];

  const beginWorkout = (routine: Routine | null) => {
    startSession(routine);
    navigation.navigate("ActiveWorkout");
  };

  return (
    <View className="flex-1 bg-void">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 56, paddingBottom: 40 }}>
        <View className="px-6 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-mist font-body text-sm mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </Text>
            <Text className="text-bone font-display text-3xl">{greetingForHour()}</Text>
          </View>
          <View className="flex-row items-center bg-ink2 border border-line px-3 py-2 rounded-full">
            <Flame size={16} color={colors.ember} />
            <Text className="text-bone font-body_semibold text-sm ml-1.5">{streak}</Text>
          </View>
        </View>

        <View className="px-6 mt-6">
          <WeekStrip days={weekDays} />
        </View>

        <View className="flex-row px-6 mt-6">
          <QuickStat label="This Week" value={`${weeklyVolume.toLocaleString()}`} suffix="lb" />
          <QuickStat
            label="Last Workout"
            value={lastWorkout ? lastWorkout.routineName : "—"}
            suffix={lastWorkout ? new Date(lastWorkout.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
          />
        </View>

        <View className="flex-row px-6 mt-3">
          <PrimaryButton
            label="Progress"
            variant="ghost"
            size="md"
            icon={<LineChart size={16} color={colors.bone} />}
            onPress={() => navigation.navigate("Progress")}
            className="flex-1 mr-2"
          />
          <PrimaryButton
            label="Missions"
            variant="ghost"
            size="md"
            icon={<Award size={16} color={colors.bone} />}
            onPress={() => navigation.navigate("Missions")}
            className="flex-1 ml-2"
          />
        </View>

        <View className="px-6 mt-8 items-center">
          <ProgressRing progress={progress} size={200} strokeWidth={16} gradientId="dashRing">
            <Text className="text-bone font-display text-5xl">{minutesToday}</Text>
            <Text className="text-mist font-body text-sm mt-1">of {settings.dailyGoalMinutes} min goal</Text>
          </ProgressRing>

          <PrimaryButton
            label="Quick Start"
            variant="volt"
            icon={<Play size={18} color={colors.void} fill={colors.void} />}
            onPress={() => beginWorkout(routines[0] ?? null)}
            className="mt-8 w-full"
          />
        </View>

        <View className="mt-10">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-bone font-display_medium text-xl">Your Routines</Text>
            <PrimaryButton
              label="New"
              variant="ghost"
              size="md"
              icon={<Plus size={16} color={colors.bone} />}
              onPress={() => navigation.navigate("RoutineEditor", { routineId: "new" })}
            />
          </View>
          <View style={{ height: 176 }}>
            <FlashList
              data={routines}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RoutineCard
                  routine={item}
                  onPress={() => beginWorkout(item)}
                  onEdit={() => navigation.navigate("RoutineEditor", { routineId: item.id })}
                />
              )}
            />
          </View>
        </View>

        <View className="px-6 mt-8">
          <Pressable
            onPress={() => setWarmupOpen((o) => !o)}
            className="flex-row items-center justify-between mb-3"
          >
            <Text className="text-bone font-display_medium text-xl">Warm-Up</Text>
            {warmupOpen ? <ChevronUp size={20} color={colors.mist} /> : <ChevronDown size={20} color={colors.mist} />}
          </Pressable>
          {warmupOpen && (
            <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(160)}>
              {WARMUP_EXERCISES.map((w) => (
                <WarmupRow key={w.id} exercise={w} />
              ))}
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function QuickStat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <View className="flex-1 bg-ink2 border border-line rounded-2xl py-4 px-3 mx-1 items-center">
      <Text numberOfLines={1} className="text-bone font-display text-lg">
        {value}
      </Text>
      {!!suffix && <Text className="text-smoke font-body text-[10px] mt-0.5">{suffix}</Text>}
      <Text className="text-smoke font-body text-[10px] uppercase tracking-wider mt-1">{label}</Text>
    </View>
  );
}
