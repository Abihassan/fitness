import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoryGridScreen from "../screens/tabs/exercises/CategoryGridScreen";
import CategoryDetailScreen from "../screens/tabs/exercises/CategoryDetailScreen";
import ExerciseDetailScreen from "../screens/tabs/exercises/ExerciseDetailScreen";
import ChallengeDetailScreen from "../screens/tabs/exercises/ChallengeDetailScreen";
import { colors } from "../theme/colors";
import type { ExercisesStackParamList } from "./types";

const Stack = createNativeStackNavigator<ExercisesStackParamList>();

// gym's original ExerciseStack.tsx wired ~30 screens by hand (18 category
// screens + 6x variations/exercises/detail per strength muscle group) —
// all reading from static, near-duplicated data. These 3 screens replace
// all of it: one grid, one filtered-list screen driven by CategoryFilter,
// one exercise detail screen driven by an exerciseId. Same navigation feel
// (grid -> list -> detail), a fraction of the files to maintain.
export default function ExercisesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerTintColor: colors.bone,
        headerStyle: { backgroundColor: colors.void },
        headerBackTitle: "Back",
        contentStyle: { backgroundColor: colors.void },
      }}
    >
      <Stack.Screen name="CategoryGrid" component={CategoryGridScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    </Stack.Navigator>
  );
}
