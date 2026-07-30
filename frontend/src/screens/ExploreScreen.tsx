import React, { useRef } from "react";
import { Animated, Dimensions, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const slides: Slide[] = [
  { id: "1", title: "Exercise Library", description: "Hundreds of exercises with variations for all levels", image: require("../../assets/images/welcome2.png") },
  { id: "2", title: "Missions or Free Mode", description: "Choose mission challenges or train freely", image: require("../../assets/images/welcome3.png") },
  { id: "3", title: "Gym Training & Workouts", description: "Access structured plans or train on your own in the gym", image: require("../../assets/images/welcome4.png") },
  { id: "4", title: "Stay Consistent", description: "Build habits and keep an honest streak, entirely on-device", image: require("../../assets/images/welcome5.png") },
  { id: "5", title: "Track Progress", description: "Every set, every PR, charted automatically", image: require("../../assets/images/welcome6.png") },
];

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: "clamp" });
    const translateY = scrollX.interpolate({ inputRange, outputRange: [40, 0, 40], extrapolate: "clamp" });

    return (
      <View style={{ width, alignItems: "center", paddingTop: 100, paddingHorizontal: 32 }}>
        <Animated.Image
          source={item.image}
          style={{ width: 240, height: 240, marginBottom: 48, opacity, transform: [{ translateY }] }}
          resizeMode="contain"
        />
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Text className="text-bone font-display text-3xl text-center mb-4">{item.title}</Text>
          <Text className="text-mist font-body text-base text-center leading-6">{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-void">
      <Pressable
        onPress={() => navigation.replace("PersonalizePath")}
        style={{ position: "absolute", top: 56, right: 24, zIndex: 10 }}
      >
        <Text className="text-mist font-body_semibold text-base">Skip</Text>
      </Pressable>

      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1.2, 0.8], extrapolate: "clamp" });
          return (
            <Animated.View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.volt,
                marginHorizontal: 6,
                transform: [{ scale }],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
