import React from "react";
import { Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-void items-center px-6" style={{ paddingTop: 90 }}>
      <View style={{ width: 240, height: 240 }}>
        <Image
          source={require("../../assets/images/welcome1.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      <Text className="text-bone font-display text-3xl text-center mt-8 leading-tight">
        Welcome to your{"\n"}all-in-one fitness app
      </Text>
      <Text className="text-mist font-body text-base text-center mt-4">
        Routines, live logging, and progress tracking — no account required to start.
      </Text>

      <View style={{ flex: 1 }} />

      <View className="w-full pb-4">
        <PrimaryButton label="Get Started" variant="volt" onPress={() => navigation.navigate("Explore")} />
      </View>
    </View>
  );
}
