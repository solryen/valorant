import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AppLanguage,
  getAppLanguagePreference,
  mergeGuestLanguageToUser,
  setAppLanguagePreference,
} from "@/lib/appLanguage";
import { detectAutoLanguageFromDevice } from "@/lib/languageDetection";

type AppLanguageContextValue = {
  language: AppLanguage;
  setLanguage: (next: AppLanguage) => Promise<void>;
  isReady: boolean;
};

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);
const MIA_HISTORY_KEYS = ["@todayler_mia_history_v3", "@todayler_mia_history"];

export function AppLanguageProvider({
  userId,
  children,
}: {
  userId?: string | null;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<AppLanguage>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (userId) {
        await mergeGuestLanguageToUser(userId);
      }
      let savedPref = await getAppLanguagePreference(userId);
      if (!savedPref) {
        savedPref = {
          language: detectAutoLanguageFromDevice(),
          source: "auto",
        };
        await setAppLanguagePreference(userId, savedPref);
      }
      if (!active) return;
      setLanguageState(savedPref.language);
      setIsReady(true);
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  const setLanguage = useCallback(
    async (next: AppLanguage) => {
      const normalized: AppLanguage = next === "el" ? "el" : "en";
      if (language !== normalized) {
        await AsyncStorage.multiRemove(MIA_HISTORY_KEYS).catch(() => {});
      }
      setLanguageState(normalized);
      await setAppLanguagePreference(userId, { language: normalized, source: "manual" });
    },
    [language, userId]
  );

  const value = useMemo(
    () => ({ language, setLanguage, isReady }),
    [language, setLanguage, isReady]
  );

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage() {
  const ctx = useContext(AppLanguageContext);
  if (!ctx) throw new Error("useAppLanguage must be used within AppLanguageProvider");
  return ctx;
}
