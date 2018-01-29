import data from '../data';
import buildSearch from './build-search';

const _JSON = JSON;

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

export function unifiedToNative(unified: string) {
  const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
  return String.fromCodePoint(...codePoints);
}

export function sanitize(emoji) {
  const id = emoji.id || emoji.short_names[0];
  let colons = `:${id}:`;

  if (emoji.custom) {
    return {
      id,
      name,
      colons,
      emoticons: emoji.emoticons,
      custom: emoji.custom,
      imageUrl: emoji.imageUrl,
    };
  }

  if (emoji.skin_tone) {
    colons += `:skin-tone-${emoji.skin_tone}:`;
  }

  return {
    id,
    name,
    colons,
    emoticons: emoji.emoticons,
    unified: emoji.unified.toLowerCase(),
    skin: emoji.skin_tone || (emoji.skin_variations ? 1 : null),
    native: unifiedToNative(emoji.unified),
  };
}

export function getSanitizedData(emoji, skin?, set?) {
  return sanitize(getData(emoji, skin, set));
}

export function getData(emoji, skin?, set?) {
  if (!emoji) {
    return;
  }
  let emojiData: any = {};

  if (typeof emoji === 'string') {
    const matches = emoji.match(COLONS_REGEX);

    if (matches) {
      emoji = matches[1];

      if (matches[2]) {
        skin = parseInt(matches[2], 10);
      }
    }

    if (data.short_names.hasOwnProperty(emoji)) {
      emoji = data.short_names[emoji];
    }

    if (data.emojis.hasOwnProperty(emoji)) {
      emojiData = data.emojis[emoji];
    } else {
      return null;
    }
  } else if (emoji.id) {
    if (data.short_names.hasOwnProperty(emoji.id)) {
      emoji.id = data.short_names[emoji.id];
    }

    if (data.emojis.hasOwnProperty(emoji.id)) {
      emojiData = data.emojis[emoji.id];
      if (skin) {
        skin = emoji.skin;
      }
    }
  }

  if (!Object.keys(emojiData).length) {
    emojiData = emoji;
    emojiData.custom = true;

    if (!emojiData.search) {
      emojiData.search = buildSearch(emoji);
    }
  }

  if (emojiData.emoticons) {
    emojiData.emoticons = [];
  }
  if (emojiData.variations) {
    emojiData.variations = [];
  }

  if (emojiData.skin_variations && skin > 1 && set) {
    emojiData = JSON.parse(_JSON.stringify(emojiData));

    const skinKey = SKINS[skin - 1];
    const variationData = emojiData.skin_variations[skinKey];

    if (!variationData.variations && emojiData.variations) {
      delete emojiData.variations;
    }

    if (variationData[`has_img_${set}`]) {
      emojiData.skin_tone = skin;

      for (const k of Object.keys(variationData)) {
        const v = variationData[k];
        emojiData[k] = v;
      }
    }
  }

  if (emojiData.variations && emojiData.variations.length) {
    emojiData = JSON.parse(_JSON.stringify(emojiData));
    emojiData.unified = emojiData.variations.shift();
  }

  return emojiData;
}

function uniq(arr) {
  return arr.reduce((acc, item) => {
    if (acc.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function intersect(a, b) {
  const uniqA = uniq(a);
  const uniqB = uniq(b);

  return uniqA.filter(item => uniqB.indexOf(item) >= 0);
}

export function deepMerge(a, b) {
  const o = {};

  for (const key of a) {
    const originalValue = a[key];
    let value = originalValue;

    if (b.hasOwnProperty(key)) {
      value = b[key];
    }

    if (typeof value === 'object') {
      value = deepMerge(originalValue, value);
    }

    o[key] = value;
  }

  return o;
}

// https://github.com/sonicdoe/measure-scrollbar
export function measureScrollbar() {
  if (typeof document === 'undefined') {
    return 0;
  }
  const div = document.createElement('div');

  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';

  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return scrollbarWidth;
}
