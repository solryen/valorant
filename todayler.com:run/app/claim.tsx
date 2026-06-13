import React from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const APP_STORE_URL = "https://apps.apple.com/us/app/todayler/id6761668150";

export default function ClaimScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 40 : insets.top + 20;
  const botPad = Platform.OS === "web" ? 32 : insets.bottom + 20;

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: botPad }]}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Todayler</Text>
        <Text style={styles.title}>Claim your account</Text>
        <Text style={styles.body}>
          Your onboarding is saved. Open the app to continue with your account there.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.buttonWrap,
            pressed && styles.buttonWrapPressed,
          ]}
          onPress={() => {
            void Linking.openURL(APP_STORE_URL);
          }}
        >
          {({ pressed }) => (
            <View style={styles.buttonShadowShell}>
              <LinearGradient
                colors={pressed ? ["#FCFCFC", "#F4F4F4"] : [Colors.white, "#FAFAFA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.button, pressed && styles.buttonPressed]}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="logo-apple" size={18} color={Colors.charcoal} />
                  <Text style={styles.buttonText}>Claim</Text>
                </View>
              </LinearGradient>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.white,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.muted,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 34,
    lineHeight: 40,
    color: Colors.charcoal,
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontFamily: "Nunito_400Regular",
    fontSize: 17,
    lineHeight: 27,
    color: Colors.muted,
    textAlign: "center",
    marginBottom: 28,
  },
  buttonWrap: {
    borderRadius: 999,
  },
  buttonWrapPressed: {
    transform: [{ scale: 0.985 }],
  },
  buttonShadowShell: {
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  button: {
    minWidth: 208,
    borderRadius: 999,
    paddingHorizontal: 32,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.white,
  },
  buttonPressed: {
    shadowOpacity: 0.09,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    letterSpacing: 0.2,
    color: Colors.charcoal,
    marginLeft: 8,
  },
});
