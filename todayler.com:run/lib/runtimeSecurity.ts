import { Platform } from "react-native";

type RuntimeSecuritySnapshot = {
  isDebuggerAttached: boolean;
  isEmulatorLike: boolean;
};

function detectDebuggerAttached(): boolean {
  try {
    // Works in Hermes/JSC without requiring extra native modules.
    const hasRemoteDebugProxy = typeof (globalThis as any).__REMOTEDEV__ !== "undefined";
    const hasNativeCallSyncHook = typeof (globalThis as any).nativeCallSyncHook === "function";
    const hasDevToolsHook = typeof (globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined";
    return hasRemoteDebugProxy || hasDevToolsHook || !hasNativeCallSyncHook;
  } catch {
    return false;
  }
}

function detectEmulatorLikeRuntime(): boolean {
  try {
    const constants = (globalThis as any)?.expo?.modules?.Constants?.expoConfig ?? null;
    const hostUri = String(constants?.hostUri ?? "");
    return hostUri.includes("localhost") || hostUri.includes("127.0.0.1");
  } catch {
    return false;
  }
}

export function getRuntimeSecuritySnapshot(): RuntimeSecuritySnapshot {
  return {
    isDebuggerAttached: detectDebuggerAttached(),
    isEmulatorLike: detectEmulatorLikeRuntime(),
  };
}

export function runSoftRuntimeSecurityChecks(): void {
  if (__DEV__) return;
  try {
    const snapshot = getRuntimeSecuritySnapshot();
    if (snapshot.isDebuggerAttached) {
      console.warn("[security] Debugger/devtools detected at runtime.");
    }
    if (snapshot.isEmulatorLike && Platform.OS !== "web") {
      console.warn("[security] Emulator-like runtime detected.");
    }
  } catch {
    // Never break app startup due to telemetry-only security checks.
  }
}

