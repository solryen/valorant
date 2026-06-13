import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function AndroidNoticeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 40 : insets.top + 20;
  const botPad = Platform.OS === "web" ? 32 : insets.bottom + 20;

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: botPad }]}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Todayler</Text>
        <Text style={styles.title}>We are only available on the App Store</Text>
        <Text style={styles.body}>
          We apologise for the inconvenience. Please open Todayler on an iPhone or from the App Store.
        </Text>
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
    fontSize: 32,
    lineHeight: 38,
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
  },
});
