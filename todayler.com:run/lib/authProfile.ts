import type { Profile } from "@/lib/supabase";

export type NormalizedProfile = Profile & {
  baby_data: Record<string, unknown>;
  onboardingComplete: boolean;
  wasRepaired: boolean;
};

export function normalizeProfile(profile: Profile | null): NormalizedProfile | null {
  if (!profile) return null;

  const babyData =
    profile.baby_data && typeof profile.baby_data === "object" && !Array.isArray(profile.baby_data)
      ? (profile.baby_data as Record<string, unknown>)
      : {};

  const wasRepaired = babyData !== profile.baby_data;
  const onboardingComplete = Boolean(babyData.onboardingComplete);

  return {
    ...profile,
    baby_data: babyData,
    onboardingComplete,
    wasRepaired,
  };
}
