import React, { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import { GripVertical } from "lucide-react-native";
import { colors } from "../theme/colors";

function clamp(n: number, lo: number, hi: number) {
  "worklet";
  return Math.min(hi, Math.max(lo, n));
}

interface DraggableListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  rowHeight: number; // fixed height per row — required for slot math
  onReorder: (newOrder: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
}

/**
 * Every row reads two shared values owned by the list — `draggedIndex` (-1
 * when idle) and `dragTranslateY` (the actively-dragged row's raw finger
 * offset). Non-dragged rows derive their own visual slot from those two
 * values on the UI thread: if the dragged row has been pulled past them,
 * they shift one slot the other way. Only on release does the actual data
 * array get reordered (via runOnJS -> onReorder), so drag itself never
 * touches React state or re-renders anything.
 */
export default function DraggableList<T>({
  data,
  keyExtractor,
  rowHeight,
  onReorder,
  renderItem,
}: DraggableListProps<T>) {
  const draggedIndex = useSharedValue(-1);
  const dragTranslateY = useSharedValue(0);
  const containerHeight = data.length * rowHeight;

  // Stable per-item gesture + animated style, built once per data identity.
  const rows = useMemo(
    () =>
      data.map((item, index) => ({
        key: keyExtractor(item),
        item,
        index,
      })),
    [data, keyExtractor]
  );

  return (
    <View style={{ height: containerHeight }}>
      {rows.map(({ key, item, index }) => (
        <Row
          key={key}
          index={index}
          count={data.length}
          rowHeight={rowHeight}
          draggedIndex={draggedIndex}
          dragTranslateY={dragTranslateY}
          onDragEnd={(finalOrderIndices) => {
            const reordered = finalOrderIndices.map((i) => data[i]);
            onReorder(reordered);
          }}
        >
          {(isDragging) => renderItem(item, index, isDragging)}
        </Row>
      ))}
    </View>
  );
}

function Row({
  index,
  count,
  rowHeight,
  draggedIndex,
  dragTranslateY,
  onDragEnd,
  children,
}: {
  index: number;
  count: number;
  rowHeight: number;
  draggedIndex: SharedValue<number>;
  dragTranslateY: SharedValue<number>;
  onDragEnd: (finalOrderIndices: number[]) => void;
  children: (isDragging: boolean) => React.ReactNode;
}) {
  const isDragging = useSharedValue(false);

  const handleDragEnd = (fromIndex: number, translationY: number) => {
    const rawTarget = fromIndex + Math.round(translationY / rowHeight);
    const targetIndex = Math.min(count - 1, Math.max(0, rawTarget));

    // Build the new index order: pull fromIndex out, splice it back in at
    // targetIndex, express as "which original index sits in each slot now".
    const order = Array.from({ length: count }, (_, i) => i);
    const [moved] = order.splice(fromIndex, 1);
    order.splice(targetIndex, 0, moved);
    onDragEnd(order);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      draggedIndex.value = index;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      const maxOffset = (count - 1 - index) * rowHeight;
      const minOffset = -index * rowHeight;
      dragTranslateY.value = clamp(event.translationY, minOffset, maxOffset);
    })
    .onEnd((event) => {
      const finalTranslation = dragTranslateY.value;
      draggedIndex.value = -1;
      isDragging.value = false;
      dragTranslateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      runOnJS(handleDragEnd)(index, finalTranslation);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const amBeingDragged = draggedIndex.value === index;

    if (amBeingDragged) {
      return {
        transform: [{ translateY: dragTranslateY.value }, { scale: 1.02 }],
        zIndex: 10,
        shadowOpacity: 0.35,
        elevation: 6,
      };
    }

    let visualSlot = index;
    if (draggedIndex.value !== -1) {
      const projected = clamp(
        draggedIndex.value + Math.round(dragTranslateY.value / rowHeight),
        0,
        count - 1
      );
      if (draggedIndex.value < index && projected >= index) visualSlot = index - 1;
      if (draggedIndex.value > index && projected <= index) visualSlot = index + 1;
    }

    return {
      transform: [
        { translateY: withSpring((visualSlot - index) * rowHeight, { damping: 20, stiffness: 260 }) },
      ],
      zIndex: 1,
      shadowOpacity: 0,
      elevation: 0,
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", left: 0, right: 0, top: index * rowHeight, height: rowHeight },
        animatedStyle,
      ]}
    >
      <View className="flex-1 flex-row items-stretch">
        <GestureDetector gesture={pan}>
          <View className="w-8 items-center justify-center">
            <GripVertical size={16} color={colors.smoke} />
          </View>
        </GestureDetector>
        <View className="flex-1">{children(false)}</View>
      </View>
    </Animated.View>
  );
}
