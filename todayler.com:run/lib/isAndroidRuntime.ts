import { Platform } from "react-native";

export function isAndroidRuntime(): boolean {
  if (Platform.OS === "android") {
    return true;
  }

  if (Platform.OS !== "web") {
    return false;
  }

  try {
    if (typeof navigator === "undefined") {
      return false;
    }
    return /Android/i.test(navigator.userAgent);
  } catch {
    return false;
  }
}
