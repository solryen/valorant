import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const envFileCandidates = [
  path.resolve(rootDir, 'todayler:explore/.env.local'),
  path.resolve(rootDir, 'todayler:explore/.env'),
];
const outputFilePath = path.resolve(rootDir, 'src/data/heroPexelsImages.js');

const HERO_BUCKETS = [
  { key: '0-2', label: 'newborn' },
  { key: '3-5', label: 'young baby' },
  { key: '6-8', label: 'baby' },
  { key: '9-11', label: 'crawling baby' },
  { key: '12-17', label: 'toddler' },
  { key: '18-24', label: 'older toddler' },
];

const HERO_QUERIES = {
  spark: {
    '0-2': 'newborn parent face',
    '3-5': 'baby watching parent face',
    '6-8': 'baby watching toy',
    '9-11': 'baby exploring toy',
    '12-17': 'toddler curious parent',
    '18-24': 'toddler learning with parent',
  },
  move: {
    '0-2': 'newborn tummy time',
    '3-5': 'baby play mat',
    '6-8': 'baby rolling on blanket',
    '9-11': 'baby crawling floor',
    '12-17': 'toddler walking with parent',
    '18-24': 'toddler moving around parent',
  },
  play: {
    '0-2': 'parent cuddling newborn',
    '3-5': 'baby smiling parent',
    '6-8': 'baby playing with parent',
    '9-11': 'baby playing blocks',
    '12-17': 'toddler playing with parent',
    '18-24': 'toddler playing together parent',
  },
};

const FALLBACK_IMAGES = {
  spark: 'https://images.pexels.com/photos/2305594/pexels-photo-2305594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  move: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  play: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const contents = readFileSync(filePath, 'utf8');
  const parsed = {};

  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key) {
      parsed[key] = value;
    }
  }

  return parsed;
}

function loadPexelsKey() {
  const localEnv = envFileCandidates.map(parseEnvFile).find((env) => env.PEXELS_API_KEY);
  return localEnv?.PEXELS_API_KEY ?? process.env.PEXELS_API_KEY ?? '';
}

function resolveHeroBucket(months) {
  if (months < 3) return '0-2';
  if (months < 6) return '3-5';
  if (months < 9) return '6-8';
  if (months < 12) return '9-11';
  if (months < 18) return '12-17';
  return '18-24';
}

async function fetchPexelsImage(apiKey, query) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&size=medium`,
    {
      headers: {
        Authorization: apiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Pexels request failed for "${query}" with status ${response.status}`);
  }

  const data = await response.json();
  const photo = Array.isArray(data.photos) ? data.photos[0] : null;
  return photo?.src?.medium ?? photo?.src?.landscape ?? null;
}

async function main() {
  const apiKey = loadPexelsKey();
  if (!apiKey) {
    console.warn('PEXELS_API_KEY not found. Keeping the existing hero image map.');
    process.exit(0);
  }

  const currentFileExists = existsSync(outputFilePath);
  const shouldSkip = currentFileExists && !process.env.FORCE_HERO_IMAGE_SYNC;
  if (shouldSkip) {
    return;
  }

  const imageMap = {};
  for (const bucket of HERO_BUCKETS) {
    imageMap[bucket.key] = {};
    for (const category of Object.keys(HERO_QUERIES)) {
      const query = HERO_QUERIES[category][bucket.key];
      try {
        const imageUrl = await fetchPexelsImage(apiKey, query);
        imageMap[bucket.key][category] = imageUrl ?? FALLBACK_IMAGES[category];
      } catch (error) {
        console.warn(`Falling back for ${bucket.key}/${category}:`, error.message);
        imageMap[bucket.key][category] = FALLBACK_IMAGES[category];
      }
    }
  }

  const fileContents = `const HERO_PEXELS_IMAGE_MAP = ${JSON.stringify(imageMap, null, 2)};\n\nconst HERO_PEXELS_FALLBACKS = ${JSON.stringify(FALLBACK_IMAGES, null, 2)};\n\nfunction resolveHeroMonthBucket(months) {\n  if (!Number.isFinite(months)) {\n    return '0-2';\n  }\n\n  if (months < 3) return '0-2';\n  if (months < 6) return '3-5';\n  if (months < 9) return '6-8';\n  if (months < 12) return '9-11';\n  if (months < 18) return '12-17';\n  return '18-24';\n}\n\nexport function getHeroActivityImageUrl(months, category) {\n  const bucketKey = resolveHeroMonthBucket(months);\n  return (\n    HERO_PEXELS_IMAGE_MAP[bucketKey]?.[category] ??\n    HERO_PEXELS_FALLBACKS[category] ??\n    HERO_PEXELS_FALLBACKS.spark\n  );\n}\n`;

  mkdirSync(path.dirname(outputFilePath), { recursive: true });
  writeFileSync(outputFilePath, fileContents, 'utf8');
  console.log(`Wrote hero image map to ${outputFilePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
