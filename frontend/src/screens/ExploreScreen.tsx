import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  description: string;
  image: any;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Exercise Library",
    description: "Hundreds of exercises with variations for all levels",
    image: require("../../assets/images/welcome2.png"),
  },
  {
    id: "2",
    title: "Missions or Free Mode",
    description: "Choose mission challenges or train freely",
    image: require("../../assets/images/welcome3.png"),
  },
  {
    id: "3",
    title: "Gym Training & Workouts",
    description: "Access structured plans or train on your own in the gym",
    image: require("../../assets/images/welcome4.png"),
  },
  {
    id: "4",
    title: "Stay Consistent",
    description: "Build habits with daily reminders and progress tracking",
    image: require("../../assets/images/welcome5.png"),
  },
  {
    id: "5",
    title: "Track Progress",
    description: "Track workouts and stay consistent",
    image: require("../../assets/images/welcome6.png"),
  },
];

const ExploreScreen = () => {
  const navigation = useNavigation<any>();
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 0, 40],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.slide}>
        <Animated.Image
          source={item.image}
          style={[
            styles.image,
            { opacity, transform: [{ translateY }] },
          ]}
          resizeMode="contain"
        />

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("PersonalizePath")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { transform: [{ scale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },

  slide: {
    width,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 24,
  },

  image: {
    width: 600,
    height: 280,
    marginBottom: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: colors.bone,
    marginBottom: 24,
  },

  description: {
    fontSize: 16,
    color: colors.mist,
    textAlign: "center",
    lineHeight: 22,
  },

  skipButton: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 10,
  },

  skipText: {
    fontSize: 16,
    color: colors.mist,
    fontWeight: "600",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.volt,
    marginHorizontal: 6,
  },
});
