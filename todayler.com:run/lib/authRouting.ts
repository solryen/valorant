export type PostAuthRoute = "/onboarding/step1" | "/claim";

type RouteInput = {
  user: { id: string } | null | undefined;
  onboardingComplete: boolean;
  isSubscribed: boolean;
};

export function getPostAuthRoute(input: RouteInput): PostAuthRoute {
  // Route precedence is intentional and shared across bootstrap/login/OAuth paths.
  // 1) Signed out -> onboarding
  // 2) Signed in + onboarding incomplete -> onboarding
  // 3) Signed in + onboarding complete -> claim
  if (!input.user) return "/onboarding/step1";
  if (!input.onboardingComplete) return "/onboarding/step1";
  return "/claim";
}
