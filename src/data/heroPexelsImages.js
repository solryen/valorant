const HERO_PEXELS_IMAGE_MAP = {
  "0-2": {
    "spark": "https://images.pexels.com/photos/35926639/pexels-photo-35926639.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/6849284/pexels-photo-6849284.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/27175604/pexels-photo-27175604.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  "3-5": {
    "spark": "https://images.pexels.com/photos/9455860/pexels-photo-9455860.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/6849270/pexels-photo-6849270.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/11369372/pexels-photo-11369372.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  "6-8": {
    "spark": "https://images.pexels.com/photos/36746429/pexels-photo-36746429.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/14243394/pexels-photo-14243394.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/6393141/pexels-photo-6393141.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  "9-11": {
    "spark": "https://images.pexels.com/photos/31137011/pexels-photo-31137011.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/3912436/pexels-photo-3912436.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/5215553/pexels-photo-5215553.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  "12-17": {
    "spark": "https://images.pexels.com/photos/3850009/pexels-photo-3850009.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/27587778/pexels-photo-27587778.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/6274932/pexels-photo-6274932.jpeg?auto=compress&cs=tinysrgb&h=350"
  },
  "18-24": {
    "spark": "https://images.pexels.com/photos/4934138/pexels-photo-4934138.jpeg?auto=compress&cs=tinysrgb&h=350",
    "move": "https://images.pexels.com/photos/6274932/pexels-photo-6274932.jpeg?auto=compress&cs=tinysrgb&h=350",
    "play": "https://images.pexels.com/photos/6274932/pexels-photo-6274932.jpeg?auto=compress&cs=tinysrgb&h=350"
  }
};

const HERO_PEXELS_FALLBACKS = {
  "spark": "https://images.pexels.com/photos/2305594/pexels-photo-2305594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "move": "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "play": "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
};

function resolveHeroMonthBucket(months) {
  if (!Number.isFinite(months)) {
    return '0-2';
  }

  if (months < 3) return '0-2';
  if (months < 6) return '3-5';
  if (months < 9) return '6-8';
  if (months < 12) return '9-11';
  if (months < 18) return '12-17';
  return '18-24';
}

export function getHeroActivityImageUrl(months, category) {
  const bucketKey = resolveHeroMonthBucket(months);
  return (
    HERO_PEXELS_IMAGE_MAP[bucketKey]?.[category] ??
    HERO_PEXELS_FALLBACKS[category] ??
    HERO_PEXELS_FALLBACKS.spark
  );
}
