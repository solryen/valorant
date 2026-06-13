import { getLocales } from "expo-localization";
import type { AppLanguage } from "@/lib/appLanguage";

function isGreekLocaleTag(tag?: string | null): boolean {
  if (!tag) return false;
  const normalized = tag.toLowerCase();
  return normalized === "el" || normalized.startsWith("el-");
}

function isGreekRegion(region?: string | null): boolean {
  return String(region ?? "").toUpperCase() === "GR";
}

export function detectAutoLanguageFromDevice(): AppLanguage {
  try {
    const locales = getLocales();
    if (!Array.isArray(locales) || locales.length === 0) return "en";

    const hasGreek = locales.some((locale) => {
      const languageTag = locale.languageTag;
      const regionCode = locale.regionCode;
      const languageCode = locale.languageCode;
      return (
        isGreekLocaleTag(languageTag) ||
        isGreekLocaleTag(languageCode) ||
        isGreekRegion(regionCode)
      );
    });

    return hasGreek ? "el" : "en";
  } catch {
    return "en";
  }
}

