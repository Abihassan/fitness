import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Check, Play, Square } from "lucide-react-native";
import { colors } from "../theme/colors";
import { formatClock } from "../utils/dateUtils";
import type { WarmupExercise } from "../data/warmups";

export default function WarmupRow({ exercise }: { exercise: WarmupExercise }) {
  const [remaining, setRemaining] = useState(exercise.durationSec);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const toggle = () => {
    if (done) {
      setDone(false);
      setRemaining(exercise.durationSec);
      setRunning(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setRunning((r) => !r);
    }
  };

  const progressPct = 1 - remaining / exercise.durationSec;

  return (
    <View className="bg-ink2 border border-line rounded-2xl px-4 py-3 mb-2 overflow-hidden">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-bone font-body_semibold text-sm">{exercise.name}</Text>
            <View className="bg-ink px-1.5 py-0.5 rounded ml-2">
              <Text className="text-smoke font-body text-[9px] uppercase tracking-wider">Warm-up</Text>
            </View>
          </View>
          <Text className="text-mist font-mono text-xs mt-1">{formatClock(remaining)}</Text>
        </View>
        <Pressable
          onPress={toggle}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: done ? colors.volt : running ? colors.ember : colors.ink }}
        >
          {done ? (
            <Check size={18} color={colors.void} strokeWidth={3} />
          ) : running ? (
            <Square size={14} color={colors.bone} fill={colors.bone} />
          ) : (
            <Play size={16} color={colors.bone} fill={colors.bone} />
          )}
        </Pressable>
      </View>
      <View className="h-1 rounded-full bg-ink mt-3 overflow-hidden">
        <View
          className="h-1 rounded-full"
          style={{ width: `${progressPct * 100}%`, backgroundColor: done ? colors.volt : colors.ember }}
        />
      </View>
    </View>
  );
}
