export interface Article {
  id: string;
  slug: string;
  language: 'el' | 'en';
  title: string;
  subtitle?: string;
  body_markdown: string;
  category: string;
  baby_age_min: number;
  baby_age_max: number;
  tags?: string[];
  featured_image_url?: string;
  author_name: string;
  authorId?: string;
  expert_reviewed: boolean;
  published_at: string;
  status?: 'published' | 'draft';
}

export const CATEGORIES_EL = [
  'Ύπνος',
  'Διατροφή',
  'Κινητικές Δεξιότητες',
  'Παιχνίδι & Ανάπτυξη',
  'Ορόσημα',
  'Συνήθειες',
  'Άλλο'
];

export const CATEGORIES_EN = [
  'Sleep',
  'First Foods',
  'Activities',
  'Motor Skills',
  'Milestones',
  'Community',
  'Other'
];

export const CATEGORIES = [
  ...new Set([...CATEGORIES_EL, ...CATEGORIES_EN])
];

export const AGE_RANGES_EL = [
  { label: '0-2 μηνών', min: 0, max: 2 },
  { label: '3-5 μηνών', min: 3, max: 5 },
  { label: '6-8 μηνών', min: 6, max: 8 },
  { label: '9-11 μηνών', min: 9, max: 11 },
  { label: '12-17 μηνών', min: 12, max: 17 },
  { label: '18-24 μηνών', min: 18, max: 24 }
];

export const AGE_RANGES_EN = [
  { label: '0-2 months', min: 0, max: 2 },
  { label: '3-5 months', min: 3, max: 5 },
  { label: '6-8 months', min: 6, max: 8 },
  { label: '9-11 months', min: 9, max: 11 },
  { label: '12-17 months', min: 12, max: 17 },
  { label: '18-24 months', min: 18, max: 24 }
];
