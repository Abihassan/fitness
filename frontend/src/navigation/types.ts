import type { NavigatorScreenParams } from "@react-navigation/native";
import type { CategoryFilter } from "../data/categories";

export type ExercisesStackParamList = {
  CategoryGrid: undefined;
  CategoryDetail: { categoryKey: string; label: string; filter: CategoryFilter };
  ExerciseDetail: { exerciseId: string };
  ChallengeDetail: { challengeId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Exercises: NavigatorScreenParams<ExercisesStackParamList>;
  Missions: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Explore: undefined;
  PersonalizePath: undefined;
  MainApp: NavigatorScreenParams<MainTabsParamList>;
  RoutineEditor: { routineId: string }; // routineId "new" = blank/template start
  ActiveWorkout: undefined;
  ExercisePicker: undefined; // pushed from RoutineEditor; result comes back via PendingSelectionContext
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
