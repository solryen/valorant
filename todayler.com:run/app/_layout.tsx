import React from "react";
import { Redirect, Stack, usePathname } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/contexts/AuthContext";
import { BabyProvider } from "@/contexts/BabyContext";
import { isAndroidRuntime } from "@/lib/isAndroidRuntime";

export default function RootLayout() {
  const pathname = usePathname();
  const isAndroid = isAndroidRuntime();

  if (isAndroid && pathname !== "/android") {
    return <Redirect href="/android" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BabyProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="android" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="paywall" />
              <Stack.Screen name="claim" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AuthProvider>
        </BabyProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
