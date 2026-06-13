import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function OnboardingLayout() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const isSigninMode = params.mode === "signin";

  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen
        name="signup"
        options={{
          gestureEnabled: isSigninMode,
          fullScreenGestureEnabled: isSigninMode,
        }}
      />
    </Stack>
  );
}
