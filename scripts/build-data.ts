import * as emojiDataRaw from 'emoji-datasource/emoji.json';
import fs from 'fs';
import path from 'node:path';
import inflection from 'inflection';
import stringifyObject from 'stringify-object';
import { fileURLToPath } from "node:url";

import { EmojiData } from './emoji.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as emojiLib from 'emojilib';
// cast types to emojiData
// @ts-expect-error
const emojiData: EmojiData[] = emojiDataRaw.default;
const categories: any[] = [];
const emojis: any[] = [];
const skins: any[] = [];
const categoriesIndex: any = {};

const catPairs = [
  ['Smileys & Emotion', 'smileys'],
  ['People & Body', 'people'],
  ['Animals & Nature', 'nature'],
  ['Food & Drink', 'foods'],
  ['Activities', 'activity'],
  ['Travel & Places', 'places'],
  ['Objects', 'objects'],
  ['Symbols', 'symbols'],
  ['Flags', 'flags']
];
const sets = ['apple', 'google', 'twitter', 'facebook'];

const unifiedToNative = (unified: string) => {
  const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
  return String.fromCodePoint(...codePoints);
}

catPairs.forEach((category, i) => {
  const [name, id] = category;
  categories[i] = { id, name, emojis: [] };
  categoriesIndex[name] = i;
});

emojiData.sort((a, b) => {
  const aTest = a.sort_order || a.short_name;
  const bTest = b.sort_order || b.short_name;

  // @ts-ignore
  return aTest - bTest;
});

function missingSets(datum: any) {
  const hidden: any[] = [];
  sets.forEach(x => {
    if (!datum[`has_img_${x}`]) {
      hidden.push(x);
    }
    delete datum[`has_img_${x}`];
  });
  if (!hidden.length) {
    return;
  }
  datum.hidden = hidden;
}

function setupSheet(datum: any) {
  datum.sheet = [datum.sheet_x, datum.sheet_y];
  delete datum.sheet_x;
  delete datum.sheet_y;
}

emojiData.forEach((datum: any) => {
  const category = datum.category;
  let categoryIndex: number;

  if (!datum.category) {
    throw new Error(`"${datum.short_name}" doesn’t have a category`);
  }

  if (!datum.name) {
    datum.name = datum.short_name.replace(/\-/g, ' ');
  }
  datum.name = inflection.titleize(datum.name || '');

  if (!datum.name) {
    throw new Error(`"${datum.short_name}" doesn’t have a name`);
  }

  datum.emoticons = datum.texts || [];
  datum.emoticons = datum.emoticons.map((x: string) => {
    if (x.endsWith('\\')) {
      return x + `\\`;
    }
    return x;
  });
  datum.text = datum.text || '';
  delete datum.texts;

  const keywords = emojiLib[unifiedToNative(datum.unified)];
  if (keywords) {
    datum.keywords = keywords;
  }

  if (datum.category === 'Component') {
    skins.push(datum);
  } else {
    categoryIndex = categoriesIndex[category];
    categories[categoryIndex].emojis.push(datum.unified);
  }

  setupSheet(datum);

  missingSets(datum);
  if (datum.skin_variations) {
    datum.skinVariations = Object.keys(datum.skin_variations).map(key => {
      const variation = datum.skin_variations[key];
      setupSheet(variation);
      missingSets(variation);
      delete variation.added_in;
      delete variation.docomo;
      delete variation.au;
      delete variation.softbank;
      delete variation.google;
      delete variation.image;
      // delete variation.short_name;
      delete variation.non_qualified;
      delete variation.category;
      delete variation.sort_order;
      delete variation.obsoleted_by;
      delete variation.obsoletes;
      return variation;
    });
    delete datum.skin_variations;
  }

  datum.shortNames = datum.short_names.filter(
    (i: any) => i !== datum.short_name
  );
  delete datum.short_names;

  // renaming
  datum.shortName = datum.short_name;
  delete datum.short_name;
  if (datum.obsoleted_by) {
    datum.obsoletedBy = datum.obsoleted_by;
  }
  delete datum.obsoleted_by;

  if (datum.text === '') {
    delete datum.text;
  }
  delete datum.added_in;
  delete datum.docomo;
  delete datum.au;
  delete datum.softbank;
  delete datum.google;
  delete datum.image;
  delete datum.subcategory;
  // delete datum.short_name;
  delete datum.non_qualified;
  delete datum.category;
  delete datum.sort_order;

  for (const key of Object.keys(datum)) {
    const value = datum[key];

    if (Array.isArray(value) && !value.length) {
      delete datum[key];
    }
  }

  emojis.push(datum);
});

const flags = categories[categoriesIndex.Flags];
flags.emojis = flags.emojis
  .filter((flag: any) => {
    // Until browsers support Flag UN
    if (flag === 'flag-un') {
      return;
    }
    return true;
  })
  .sort();

// Merge “Smileys & Emotion” and “People & Body” into a single category
const smileys = categories[0];
const people = categories[1];
const smileysAndPeople = {
  id: 'people',
  name: 'Smileys & People',
  emojis: [
    ...smileys.emojis.slice(0, 114),
    ...people.emojis,
    ...smileys.emojis.slice(114)
  ]
};

categories.unshift(smileysAndPeople);
categories.splice(1, 2);

const sEmojis = stringifyObject(emojis, {
  inlineCharacterLimit: 25,
  indent: '  '
});
let doc = `import { CompressedEmojiData } from './data.interfaces';
export const emojis: CompressedEmojiData[] = ${sEmojis};
`;
fs.writeFileSync(
  path.join(__dirname, '../src/lib/picker/ngx-emoji/data/emojis.ts'),
  doc
);

const sCategories = stringifyObject(categories, {
  inlineCharacterLimit: 25,
  indent: '  '
});
doc = `import { EmojiCategory } from './data.interfaces';
export const categories: EmojiCategory[] = ${sCategories};
`;
fs.writeFileSync(
  path.join(__dirname, '../src/lib/picker/ngx-emoji/data/categories.ts'),
  doc
);

const sSkins = stringifyObject(skins, {
  inlineCharacterLimit: 25,
  indent: '  '
});
doc = `import { SkinData } from './data.interfaces';
export const skins: SkinData[] = ${sSkins};
`;
fs.writeFileSync(
  path.join(__dirname, '../src/lib/picker/ngx-emoji/data/skins.ts'),
  doc
);

// const sShortNames = stringifyObject(short_names, {
//   inlineCharacterLimit: 25,
//   indent: '  ',
// });
// doc = `import { SkinData } from './data.interfaces';
// const data: SkinData[] = ${sShortNames}
// export default data;
// `;
// fs.writeFileSync('./src/lib/data/short-names.ts', doc);
