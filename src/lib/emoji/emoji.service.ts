import { Injectable } from '@angular/core';

import { EmojiData } from '../data/data.interfaces';
import emojis from '../data/emojis';

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

@Injectable()
export class EmojiService {
  names: { [key: string]: EmojiData } = {};

  constructor() {
    this.uncompress(emojis);
  }

  uncompress(list: EmojiData[]) {
    for (const datum of list) {
      this.names[datum.unified] = datum;
      this.names[datum.short_name] = datum;
      if (datum.short_names) {
        for (const n of datum.short_names) {
          this.names[n] = datum;
        }
      }

      if (!datum.short_names) {
        datum.short_names = [];
      }
      datum.short_names.unshift(datum.short_name);

      if (!datum.text) {
        datum.text = '';
      }

      // TODO: build search as a second seperate step
      datum.search = this.buildSearch({
        short_names: datum.short_names,
        name: datum.name,
        keywords: datum.keywords,
        emoticons: datum.emoticons,
      });
    }
  }
  getData(emoji, skin?, set?) {
    if (!emoji) {
      return;
    }
    let emojiData: any;

    if (typeof emoji === 'string') {
      const matches = emoji.match(COLONS_REGEX);

      if (matches) {
        emoji = matches[1];

        if (matches[2]) {
          skin = parseInt(matches[2], 10);
        }
      }
      emojiData = this.names[emoji];
    } else if (emoji.id) {
      emojiData = this.names[emoji.id];
      if (skin) {
        skin = emoji.skin;
      }
    }

    if (!emojiData) {
      emojiData = emoji;
      emojiData.custom = true;

      if (!emojiData.search) {
        emojiData.search = this.buildSearch(emoji);
      }
    }

    if (emojiData.emoticons) {
      emojiData.emoticons = [];
    }
    if (emojiData.variations) {
      emojiData.variations = [];
    }

    if (emojiData.skin_variations && skin > 1 && set) {
      // TODO: different solution for copying
      emojiData = JSON.parse(JSON.stringify(emojiData));

      const skinKey = SKINS[skin - 1];
      const variationData = emojiData.skin_variations.find(
        n => n.unified.indexOf(skinKey) !== -1,
      );

      if (!variationData.variations && emojiData.variations) {
        delete emojiData.variations;
      }

      if (!variationData.hidden || variationData.hidden.indexOf(set) === -1) {
        emojiData.skin_tone = skin;

        emojiData = { ...emojiData, ...variationData };
      }
    }

    if (emojiData.variations && emojiData.variations.length) {
      emojiData = JSON.parse(JSON.stringify(emojiData));
      emojiData.unified = emojiData.variations.shift();
    }

    return emojiData;
  }

  buildSearch(data) {
    const search = [];

    const addToSearch = (strings: string | string[], split: boolean) => {
      if (!strings) {
        return;
      }

      (Array.isArray(strings) ? strings : [strings]).forEach(string => {
        (split ? string.split(/[-|_|\s]+/) : [string]).forEach(s => {
          s = s.toLowerCase();

          if (search.indexOf(s) === -1) {
            search.push(s);
          }
        });
      });
    };

    addToSearch(data.short_names, true);
    addToSearch(data.name, true);
    addToSearch(data.keywords, false);
    addToSearch(data.emoticons, false);

    return search.join(',');
  }
  unifiedToNative(unified: string) {
    const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
    return String.fromCodePoint(...codePoints);
  }
  sanitize(emoji) {
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
      native: this.unifiedToNative(emoji.unified),
    };
  }
  getSanitizedData(emoji, skin?, set?) {
    return this.sanitize(this.getData(emoji, skin, set));
  }
}
