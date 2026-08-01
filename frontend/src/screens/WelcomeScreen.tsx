import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>

      {/* Illustration */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/welcome1.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Welcome to your{"\n"}all-in-one fitness app
      </Text>

      {/* Action Section */}
      <View style={styles.actionContainer}>

        {/* Google Login Text */}
        <Text style={styles.loginText}>
          Login to MAKSH with Google
        </Text>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Explore Without Account */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Explore")}
        >
          <Text style={styles.secondaryText}>
            Explore Without Account
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
    alignItems: "center",
    paddingHorizontal: 24,
  },

  imageWrapper: {
    width: 280,
    height: 280,
    marginTop: 80,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: colors.bone,
    marginTop: 24,
    lineHeight: 44,
  },

  actionContainer: {
    width: "100%",
    marginTop: 140,
    alignItems: "center",
  },

  loginText: {
    fontSize: 16,
    color: colors.mist,
    marginBottom: 16,
    fontWeight: "500",
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    backgroundColor: "#ffffff", // Keep white for Google branding
    borderRadius: 12,
    justifyContent: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  googleButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827", // Keep dark for readability on white button
  },

  secondaryText: {
    fontSize: 16,
    color: colors.volt,
    fontWeight: "600",
  },
});


export default WelcomeScreen;
