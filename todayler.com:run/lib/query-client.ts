import { fetch } from "expo/fetch";
import Constants from "expo-constants";
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Platform } from "react-native";

/**
 * Gets the base URL for the Express API server (e.g., "http://localhost:3000")
 * @returns {string} The API base URL
 */
export function getApiUrl(): string {
  try {
    const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
    if (explicit) {
      return new URL(explicit).href;
    }

    const host = process.env.EXPO_PUBLIC_DOMAIN?.trim();
    if (host) {
      if (host.startsWith("http://") || host.startsWith("https://")) {
        return new URL(host).href;
      }
      const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https";
      return new URL(`${protocol}://${host}`).href;
    }

    // Native fallback: derive host from Expo runtime (e.g., 192.168.1.10:8081 -> http://192.168.1.10:5000)
    const expoHostUri = Constants.expoConfig?.hostUri;
    if (typeof expoHostUri === "string" && expoHostUri.length > 0) {
      const machineHost = expoHostUri.split(":")[0];
      if (machineHost) {
        return `http://${machineHost}:5000/`;
      }
    }
  } catch (error) {
    console.warn("Falling back to local API URL:", error);
  }

  if (Platform.OS === "web") {
    return "http://localhost:5000/";
  }

  return "http://127.0.0.1:5000/";
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  route: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = new URL(route, baseUrl);

  const res = await fetch(url.toString(), {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiUrl();
    const url = new URL(queryKey.join("/") as string, baseUrl);

    const res = await fetch(url.toString(), {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
