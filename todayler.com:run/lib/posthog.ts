import PostHog from "posthog-react-native";
import Constants from "expo-constants";

let cachedClient: PostHog | null = null;

function createClient(): PostHog {
  const apiKey = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined;
  const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;
  const isPostHogConfigured = Boolean(apiKey && apiKey !== "phc_your_project_token_here");

  if (__DEV__) {
    console.log("PostHog config:", {
      apiKey: apiKey ? "SET" : "NOT SET",
      host: host ? "SET" : "NOT SET",
      isConfigured: isPostHogConfigured,
    });
  }

  return new PostHog(apiKey || "placeholder_key", {
    host,
    disabled: !isPostHogConfigured,
    captureAppLifecycleEvents: true,
    flushAt: 20,
    flushInterval: 10000,
    maxBatchSize: 100,
    maxQueueSize: 1000,
    preloadFeatureFlags: true,
    sendFeatureFlagEvent: true,
    featureFlagsRequestTimeoutMs: 10000,
    requestTimeout: 10000,
    fetchRetryCount: 3,
    fetchRetryDelay: 3000,
  });
}

export function getPosthogClient(): PostHog {
  if (cachedClient) return cachedClient;
  cachedClient = createClient();
  return cachedClient;
}
