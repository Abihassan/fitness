import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer, DarkTheme, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import PersonalizePathScreen from "../screens/PersonalizePathScreen";
import MainTabs from "./MainTabs";
import RoutineEditorScreen from "../screens/RoutineEditorScreen";
import ActiveWorkoutScreen from "../screens/ActiveWorkoutScreen";
import ExercisePickerScreen from "../screens/ExercisePickerScreen";
import { colors } from "../theme/colors";
import { storage } from "../storage/storage";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.void,
    card: colors.ink,
    border: colors.line,
    text: colors.bone,
    primary: colors.volt,
  },
};

export default function RootNavigator() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    storage.getOnboarded().then(setOnboarded);
  }, []);

  if (onboarded === null) {
    return <View style={{ flex: 1, backgroundColor: colors.void }} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={onboarded ? "MainApp" : "Splash"}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="PersonalizePath" component={PersonalizePathScreen} />
        <Stack.Screen name="MainApp" component={MainTabs} />
        <Stack.Screen
          name="RoutineEditor"
          component={RoutineEditorScreen}
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="ActiveWorkout"
          component={ActiveWorkoutScreen}
          options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="ExercisePicker"
          component={ExercisePickerScreen}
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
