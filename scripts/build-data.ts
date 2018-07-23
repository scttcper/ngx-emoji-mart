const emojiData = require('emoji-datasource');
const emojiLib = require('emojilib');
import * as fs from 'fs';
import * as inflection from 'inflection';
import * as stringifyObject from 'stringify-object';

const categories: any[] = [];
const emojis: any[] = [];
const skins: any[] = [];
const short_names: any = {};
const categoriesIndex: any = {};

const catPairs = [
  ['Smileys & People', 'people'],
  ['Animals & Nature', 'nature'],
  ['Food & Drink', 'foods'],
  ['Activities', 'activity'],
  ['Travel & Places', 'places'],
  ['Objects', 'objects'],
  ['Symbols', 'symbols'],
  ['Flags', 'flags'],
];
const sets = [
  'apple',
  'google',
  'twitter',
  'emojione',
  'facebook',
  'messenger',
];

catPairs.forEach((category, i) => {
  const [name, id] = category;
  categories[i] = { id: id, name: name, emojis: [] };
  categoriesIndex[name] = i;
});

emojiData.sort((a: any, b: any) => {
  const aTest = a.sort_order || a.short_name,
    bTest = b.sort_order || b.short_name;

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
  const keywords = [];
  let categoryIndex;

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

  if (emojiLib.lib[datum.short_name]) {
    datum.keywords = emojiLib.lib[datum.short_name].keywords;
  }



  if (datum.category === 'Skin Tones') {
    skins.push(datum);
  } else {
    categoryIndex = categoriesIndex[category];
    categories[categoryIndex].emojis.push(datum.unified);
  }

  setupSheet(datum);

  missingSets(datum);
  if (datum.skin_variations) {
    const variations = [];
    for (const key of Object.keys(datum.skin_variations)) {
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
      variations.push(variation);
    }
    datum.skin_variations = variations;
  }

  datum.short_names = datum.short_names.filter((i: any) => i !== datum.short_name);


  if (datum.text === '') {
    delete datum.text;
  }
  delete datum.added_in;
  delete datum.docomo;
  delete datum.au;
  delete datum.softbank;
  delete datum.google;
  delete datum.image;
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

const flags = categories[categoriesIndex['Flags']];
flags.emojis = flags.emojis
  .filter((flag: any) => {
    // Until browsers support Flag UN
    if (flag === 'flag-un') {
      return;
    }
    return true;
  })
  .sort();

const sEmojis = stringifyObject(emojis, {
  inlineCharacterLimit: 25,
  indent: '  ',
});
let doc = `import { CompressedEmojiData } from './data.interfaces';
export const emojis: CompressedEmojiData[] = ${sEmojis};
`;
fs.writeFileSync('./src/lib/emoji/data/emojis.ts', doc);


const sCategories = stringifyObject(categories, {
  inlineCharacterLimit: 25,
  indent: '  ',
});
doc = `import { EmojiCategory } from './data.interfaces';
export const categories: EmojiCategory[] = ${sCategories};
`;
fs.writeFileSync('./src/lib/emoji/data/categories.ts', doc);


const sSkins = stringifyObject(skins, {
  inlineCharacterLimit: 25,
  indent: '  ',
});
doc = `import { SkinData } from './data.interfaces';
export const skins: SkinData[] = ${sSkins};
`;
fs.writeFileSync('./src/lib/emoji/data/skins.ts', doc);


// const sShortNames = stringifyObject(short_names, {
//   inlineCharacterLimit: 25,
//   indent: '  ',
// });
// doc = `import { SkinData } from './data.interfaces';
// const data: SkinData[] = ${sShortNames}
// export default data;
// `;
// fs.writeFileSync('./src/lib/data/short-names.ts', doc);
