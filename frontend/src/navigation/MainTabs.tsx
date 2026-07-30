import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dumbbell, Home, Trophy, TrendingUp, User } from "lucide-react-native";
import HomeScreen from "../screens/tabs/HomeScreen";
import MissionsScreen from "../screens/tabs/MissionsScreen";
import ProgressScreen from "../screens/tabs/ProgressScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";
import ExercisesStack from "./ExercisesStack";
import { colors } from "../theme/colors";
import type { MainTabsParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.volt,
        tabBarInactiveTintColor: colors.smoke,
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10.5, fontFamily: "Inter_500Medium" },
        tabBarIcon: ({ color, size }) => {
          const iconSize = size ?? 20;
          if (route.name === "Home") return <Home color={color} size={iconSize} />;
          if (route.name === "Exercises") return <Dumbbell color={color} size={iconSize} />;
          if (route.name === "Missions") return <Trophy color={color} size={iconSize} />;
          if (route.name === "Progress") return <TrendingUp color={color} size={iconSize} />;
          return <User color={color} size={iconSize} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exercises" component={ExercisesStack} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
