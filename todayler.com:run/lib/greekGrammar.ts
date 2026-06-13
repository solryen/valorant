export type BabyGender = "boy" | "girl" | "unspecified" | "" | null | undefined;

export function greekNameObjectArticle(gender: BabyGender): string {
  if (gender === "boy") return "τον";
  if (gender === "girl") return "την";
  return "το μωρό σου";
}

export function greekNamePossessive(gender: BabyGender): string {
  if (gender === "boy") return "του";
  if (gender === "girl") return "της";
  return "του μωρού σου";
}

export function greekNameNeutralArticle(gender: BabyGender): string {
  if (gender === "boy") return "ο";
  if (gender === "girl") return "η";
  return "το μωρό";
}

export function greekInflectNameForObjectCase(name: string, gender: BabyGender): string {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return trimmed;
  if (gender !== "boy") return trimmed;
  return trimmed.replace(/[sς]$/i, "");
}

export function greekInflectNameForPossessiveCase(name: string, gender: BabyGender): string {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return trimmed;
  if (gender !== "boy") return trimmed;
  return trimmed.replace(/[sς]$/i, "");
}

export function greekBabyNamePossessivePhrase(name: string, gender: BabyGender): string {
  if (!String(name ?? "").trim()) return gender === "girl" || gender === "boy" ? "του μωρού σου" : "του μωρού σου";
  const inflected = greekInflectNameForPossessiveCase(name, gender);
  if (gender === "boy") return `του ${inflected}`;
  if (gender === "girl") return `της ${inflected}`;
  return "του μωρού σου";
}

export function greekBabyNameObjectPhrase(name: string, gender: BabyGender): string {
  if (!String(name ?? "").trim()) return "το μωρό σου";
  const article = greekNameObjectArticle(gender);
  const inflected = greekInflectNameForObjectCase(name, gender);
  return `${article} ${inflected}`;
}

export function greekBabyNameSubjectPhrase(name: string, gender: BabyGender): string {
  if (!String(name ?? "").trim()) return "το μωρό σου";
  const article = greekNameNeutralArticle(gender);
  const trimmed = String(name ?? "").trim();
  return `${article} ${trimmed}`;
}

export function resolveGreekGenderAlternatives(text: string, gender: BabyGender): string {
  if (!text) return text;
  const replacements: Array<[RegExp, string]> =
    gender === "boy"
      ? [
          [/του\/της/g, "του"],
          [/τον\/την/g, "τον"],
          [/το\/τη/g, "το"],
          [/ο\/η/g, "ο"],
          [/Ο\/Η/g, "Ο"],
          [/μικρού\/μικρής/g, "μικρού"],
          [/μικρό\/μικρή/g, "μικρό"],
        ]
      : gender === "girl"
      ? [
          [/του\/της/g, "της"],
          [/τον\/την/g, "την"],
          [/το\/τη/g, "τη"],
          [/ο\/η/g, "η"],
          [/Ο\/Η/g, "Η"],
          [/μικρού\/μικρής/g, "μικρής"],
          [/μικρό\/μικρή/g, "μικρή"],
        ]
      : [
          [/του\/της/g, "του μωρού σου"],
          [/τον\/την/g, "το μωρό σου"],
          [/το\/τη/g, "το μωρό σου"],
          [/ο\/η/g, "το μωρό"],
          [/Ο\/Η/g, "Το μωρό"],
          [/μικρού\/μικρής/g, "του μωρού σου"],
          [/μικρό\/μικρή/g, "το μωρό σου"],
        ];

  return replacements.reduce((acc, [pattern, value]) => acc.replace(pattern, value), text);
}
