import data from '../data';
import { getData, getSanitizedData, intersect } from '.';

// TODO: make service
const originalPool: any = {};
const index: any = {};
const emojisList: any = {};
const emoticonsList: any = {};

for (const emoji of Object.keys(data.emojis)) {
  const emojiData = data.emojis[emoji];
  const { short_names, emoticons } = emojiData;
  const id = short_names[0];

  if (emoticons) {
    emoticons.forEach(emoticon => {
      if (emoticonsList[emoticon]) {
        return;
      }

      emoticonsList[emoticon] = id;
    });
  }

  emojisList[id] = getSanitizedData(id);
  originalPool[id] = emojiData;
}


function addCustomToPool(custom, pool) {
  custom.forEach(emoji => {
    const emojiId = emoji.id || emoji.short_names[0];

    if (emojiId && !pool[emojiId]) {
      pool[emojiId] = getData(emoji);
      emojisList[emojiId] = getSanitizedData(emoji);
    }
  });
}

export function search(
  value: string,
  emojisToShowFilter: (x: any) => boolean,
  maxResults: number,
  include: any[],
  exclude: any[],
  custom: any[] = [],
) {
  addCustomToPool(custom, originalPool);

  if (!maxResults) {
    maxResults = 75;
  }
  if (!include) {
    include = [];
  }
  if (!exclude) {
    exclude = [];
  }

  let results = null;
  let pool = originalPool;

  if (value.length) {
    if (value === '-' || value === '-1') {
      return [emojisList['-1']];
    }

    let values = value.toLowerCase().split(/[\s|,|\-|_]+/);
    let allResults = [];

    if (values.length > 2) {
      values = [values[0], values[1]];
    }

    if (include.length || exclude.length) {
      pool = {};

      data.categories.forEach(category => {
        const isIncluded =
          include && include.length ? include.indexOf(category.id) > -1 : true;
        const isExcluded =
          exclude && exclude.length ? exclude.indexOf(category.id) > -1 : false;
        if (!isIncluded || isExcluded) {
          return;
        }

        category.emojis.forEach(
          emojiId => (pool[emojiId] = data.emojis[emojiId]),
        );
      });

      if (custom.length) {
        const customIsIncluded =
          include && include.length ? include.indexOf('custom') > -1 : true;
        const customIsExcluded =
          exclude && exclude.length ? exclude.indexOf('custom') > -1 : false;
        if (customIsIncluded && !customIsExcluded) {
          addCustomToPool(custom, pool);
        }
      }
    }
    console.log(values)
    console.log(pool)

    allResults = values
      .map(v => {
        let aPool = pool;
        let aIndex = index;
        let length = 0;

        for (let charIndex = 0; charIndex < v.length; charIndex++) {
          const char = v[charIndex];
          length++;
          if (!aIndex[char]) {
            aIndex[char] = {};
          }
          aIndex = aIndex[char];

          if (!aIndex.results) {
            const scores: any = {};

            aIndex.results = [];
            aIndex.pool = {};

            for (const id of Object.keys(aPool)) {
              const emoji = aPool[id];
              const query = emoji['search'];
              const sub = v.substr(0, length);
              const subIndex = query.indexOf(sub);

              if (subIndex !== -1) {
                let score = subIndex + 1;
                if (sub === id) {
                  score = 0;
                }

                aIndex.results.push(emojisList[id]);
                aIndex.pool[id] = emoji;

                scores[id] = score;
              }
            }

            aIndex.results.sort((a, b) => {
              const aScore = scores[a.id];
              const bScore = scores[b.id];

              return aScore - bScore;
            });
          }

          aPool = aIndex.pool;
        }

        return aIndex.results;
      })
      .filter(a => a);

    if (allResults.length > 1) {
      results = intersect.apply(null, allResults);
    } else if (allResults.length) {
      results = allResults[0];
    } else {
      results = [];
    }
  }

  if (results) {
    if (emojisToShowFilter) {
      results = results.filter(result =>
        emojisToShowFilter(data.emojis[result.id]),
      );
    }

    if (results && results.length > maxResults) {
      results = results.slice(0, maxResults);
    }
  }

  return results;
}

