type StartupFlags = {
  disablePosthog: boolean;
  disableTutorial: boolean;
  disableNotificationListeners: boolean;
  disableActiveTimersOverlay: boolean;
  disableSpeechListeners: boolean;
  disableRevenueCatInit: boolean;
  disableRuntimeSecurityChecks: boolean;
  enableStartupBreadcrumbs: boolean;
};

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") return true;
  if (normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off") return false;
  return fallback;
}

export const startupFlags: StartupFlags = {
  disablePosthog: parseBool(process.env.EXPO_PUBLIC_DISABLE_POSTHOG, false),
  disableTutorial: parseBool(process.env.EXPO_PUBLIC_DISABLE_TUTORIAL, false),
  disableNotificationListeners: parseBool(process.env.EXPO_PUBLIC_DISABLE_NOTIFICATION_LISTENERS, false),
  disableActiveTimersOverlay: parseBool(process.env.EXPO_PUBLIC_DISABLE_ACTIVE_TIMERS_OVERLAY, false),
  disableSpeechListeners: parseBool(process.env.EXPO_PUBLIC_DISABLE_SPEECH_LISTENERS, false),
  disableRevenueCatInit: parseBool(process.env.EXPO_PUBLIC_DISABLE_REVENUECAT_INIT, false),
  disableRuntimeSecurityChecks: parseBool(process.env.EXPO_PUBLIC_DISABLE_RUNTIME_SECURITY_CHECKS, false),
  enableStartupBreadcrumbs: parseBool(process.env.EXPO_PUBLIC_ENABLE_STARTUP_BREADCRUMBS, true),
};

export function startupBreadcrumb(step: string, payload?: unknown) {
  if (!startupFlags.enableStartupBreadcrumbs) return;
  try {
    if (payload !== undefined) {
      console.log(`[startup-breadcrumb] ${step}`, payload);
      return;
    }
    console.log(`[startup-breadcrumb] ${step}`);
  } catch {
    // no-op
  }
}
