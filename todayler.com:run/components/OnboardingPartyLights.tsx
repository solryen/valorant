import React from "react";
import { StyleSheet, View } from "react-native";

export default function OnboardingPartyLights() {
  return (
    <View pointerEvents="none" style={styles.layer}>
      <View style={[styles.light, styles.orange]} />
      <View style={[styles.light, styles.green]} />
      <View style={[styles.light, styles.blue]} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  light: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.32,
  },
  orange: {
    width: 300,
    height: 300,
    top: 22,
    right: -56,
    backgroundColor: "rgba(215, 164, 140, 0.72)",
  },
  green: {
    width: 185,
    height: 185,
    bottom: 168,
    left: -42,
    backgroundColor: "rgba(157, 184, 160, 0.9)",
  },
  blue: {
    width: 320,
    height: 320,
    bottom: -126,
    right: -44,
    backgroundColor: "rgba(169, 198, 217, 0.76)",
  },
});
