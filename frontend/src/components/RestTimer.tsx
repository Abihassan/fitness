import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { Minus, Plus, X } from "lucide-react-native";
import { colors } from "../theme/colors";
import { formatClock } from "../utils/dateUtils";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = 260;
const STROKE = 16;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RestTimerProps {
  visible: boolean;
  durationSec?: number;
  onClose: () => void;
}

export default function RestTimer({ visible, durationSec = 90, onClose }: RestTimerProps) {
  const [remaining, setRemaining] = useState(durationSec);
  const [totalDuration, setTotalDuration] = useState(durationSec);
  const progress = useSharedValue(1); // 1 = full ring, 0 = empty
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(0.92);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;
    setRemaining(durationSec);
    setTotalDuration(durationSec);

    // Entrance
    overlayOpacity.value = withTiming(1, { duration: 220 });
    overlayScale.value = withSpring(1, { damping: 14, stiffness: 180 });

    // Smooth, continuous depletion on the UI thread — independent of the
    // once-a-second JS tick used for the numeric readout below.
    progress.value = 1;
    progress.value = withTiming(0, { duration: durationSec * 1000, easing: Easing.linear });

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          onClose();
          return 0;
        }
        if (r <= 4) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, durationSec]);

  const addTime = (sec: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRemaining((r) => Math.max(0, r + sec));
    setTotalDuration((t) => Math.max(1, t + sec));
    // Re-anchor the smooth animation from wherever it currently sits toward
    // the new remaining fraction of the new total.
    const nextRemaining = Math.max(0, remaining + sec);
    const nextTotal = Math.max(1, totalDuration + sec);
    progress.value = withTiming(1 - nextRemaining / nextTotal, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  };

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * progress.value,
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1 bg-void/95 items-center justify-center px-8">
        <Animated.View style={overlayStyle} className="items-center">
          <Pressable
            onPress={onClose}
            className="absolute -top-24 right-0 w-10 h-10 rounded-full bg-ink2 items-center justify-center"
          >
            <X size={18} color={colors.mist} />
          </Pressable>

          <Text className="text-mist font-body_medium text-sm uppercase tracking-[3px] mb-8">Rest</Text>

          <View style={{ width: RING_SIZE, height: RING_SIZE }} className="items-center justify-center">
            <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: "absolute" }}>
              <Defs>
                <LinearGradient id="restRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={colors.ember} />
                  <Stop offset="100%" stopColor={colors.plasma} />
                </LinearGradient>
              </Defs>
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} stroke={colors.ink2} strokeWidth={STROKE} fill="none" />
              <AnimatedCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke="url(#restRing)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedCircleProps}
                rotation="-90"
                origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
              />
            </Svg>
            <Text className="text-bone font-display text-6xl">{formatClock(remaining)}</Text>
          </View>

          <View className="flex-row mt-10">
            <Pressable
              onPress={() => addTime(-15)}
              className="w-14 h-14 rounded-full bg-ink2 border border-line items-center justify-center mr-4"
            >
              <Minus size={20} color={colors.bone} />
            </Pressable>
            <Pressable
              onPress={() => addTime(15)}
              className="w-14 h-14 rounded-full bg-ink2 border border-line items-center justify-center"
            >
              <Plus size={20} color={colors.bone} />
            </Pressable>
          </View>

          <Pressable onPress={onClose} className="mt-10">
            <Text className="text-mist font-body_semibold text-sm">Skip rest</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
