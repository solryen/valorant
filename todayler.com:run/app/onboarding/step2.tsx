import { useEffect } from "react";
import { router } from "expo-router";

export default function Step2() {
  useEffect(() => {
    router.replace("/onboarding/step1");
  }, []);
  return null;
}
