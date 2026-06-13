import { getAppLanguage, setAppLanguage } from "@/lib/appLanguage";

export type OnboardingPaywallLanguage = "en" | "el";

export async function getOnboardingLang(userId?: string | null): Promise<OnboardingPaywallLanguage> {
  return getAppLanguage(userId);
}

export async function setOnboardingLang(
  userId: string | null | undefined,
  lang: OnboardingPaywallLanguage
): Promise<void> {
  await setAppLanguage(userId, lang);
}
