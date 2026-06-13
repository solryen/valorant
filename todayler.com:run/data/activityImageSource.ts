import { activityImages } from "./activityImages";
import type { Category } from "./activityData";

const FALLBACK_ACTIVITY_IMAGE_URL =
  "https://images.pexels.com/photos/12919504/pexels-photo-12919504.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const BANNED_IMAGE_ID_TOKENS = [
  "7946706",
  "4127352",
  "7946456",
  "36183491",
  "7947054",
] as const;

const BANNED_PAGE_URL_FRAGMENTS = [
  "parents-teaching-their-child-to-read-7946456",
] as const;

const CATEGORY_FALLBACK_URLS: Record<Category, string> = {
  spark:
    "https://images.pexels.com/photos/6623804/pexels-photo-6623804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  move:
    "https://images.pexels.com/photos/34247130/pexels-photo-34247130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  play:
    "https://images.pexels.com/photos/8430594/pexels-photo-8430594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function isBannedImageRef(urlOrPageUrl: string | undefined): boolean {
  const normalized = normalize(urlOrPageUrl);
  if (!normalized) return false;
  if (BANNED_PAGE_URL_FRAGMENTS.some((part) => normalized.includes(part))) {
    return true;
  }
  return BANNED_IMAGE_ID_TOKENS.some((id) => normalized.includes(`/${id}/`) || normalized.includes(`-${id}`));
}

function getSafeActivityImageUrl(activityId: string, category: Category): string {
  const item = activityImages[activityId];
  const candidateUrl = item?.url;

  if (candidateUrl && !isBannedImageRef(candidateUrl) && !isBannedImageRef(item?.pageUrl)) {
    return candidateUrl;
  }

  const categoryFallback = CATEGORY_FALLBACK_URLS[category];
  if (categoryFallback && !isBannedImageRef(categoryFallback)) {
    return categoryFallback;
  }

  return FALLBACK_ACTIVITY_IMAGE_URL;
}

export function getActivityImageSource(activityId: string, category: Category) {
  return { uri: getSafeActivityImageUrl(activityId, category) };
}
