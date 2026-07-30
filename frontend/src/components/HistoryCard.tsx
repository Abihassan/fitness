import React from "react";
import { Text, View } from "react-native";
import { Clock, Flame, Weight } from "lucide-react-native";
import { colors, gradients } from "../theme/colors";
import { formatDuration } from "../utils/dateUtils";
import type { HistoryEntry } from "../types";

export default function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const grad = gradients[entry.mood] ?? gradients.plasma;
  const dateLabel = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <View className="bg-ink2 border border-line rounded-3xl p-5 mb-3">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View style={{ backgroundColor: grad[0] }} className="w-2 h-2 rounded-full mr-2" />
          <Text className="text-mist font-body_medium text-xs uppercase tracking-wider">{dateLabel}</Text>
        </View>
      </View>

      <Text className="text-bone font-display text-2xl mb-4">{entry.routineName}</Text>

      <View className="flex-row">
        <Stat icon={<Clock size={14} color={colors.mist} />} value={formatDuration(entry.durationSec)} label="duration" />
        <Stat icon={<Weight size={14} color={colors.mist} />} value={`${entry.totalVolume.toLocaleString()} lb`} label="volume" />
        <Stat icon={<Flame size={14} color={colors.mist} />} value={`${entry.exercises.length}`} label="exercises" />
      </View>
    </View>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className="text-bone font-body_semibold text-sm ml-1.5">{value}</Text>
      </View>
      <Text className="text-smoke font-body text-[11px] uppercase tracking-wider">{label}</Text>
    </View>
  );
}
