import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StandaloneTabsLanding() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Todayler Standalone</Text>
      <Text style={styles.subtitle}>Onboarding completed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F4EE" },
  title: { fontSize: 24, fontWeight: "800", color: "#2B2018" },
  subtitle: { marginTop: 8, fontSize: 15, color: "#7A6A5F" },
});
