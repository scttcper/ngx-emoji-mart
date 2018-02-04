import { Injectable } from '@angular/core';

import { CompressedEmojiData, EmojiData } from '../data/data.interfaces';
import emojis from '../data/emojis';
import { Emoji } from './emoji.component';

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

@Injectable()
export class EmojiService {
  names: { [key: string]: EmojiData } = {};

  constructor() {
    this.uncompress(emojis);
  }

  uncompress(list: CompressedEmojiData[]) {
    list.forEach((data: any) => {
      if (!data.short_names) {
        data.short_names = [];
      }
      data.short_names.unshift(data.short_name);
      data.id = data.short_name;
      data.native = this.unifiedToNative(data.unified);

      if (!data.skin_variations) {
        data.skin_variations = [];
      }

      if (!data.keywords) {
        data.keywords = [];
      }

      if (!data.emoticons) {
        data.emoticons = [];
      }

      if (!data.hidden) {
        data.hidden = [];
      }

      if (!data.text) {
        data.text = '';
      }

      // TODO: build search as a second seperate step
      data.search = this.buildSearch(
        data.short_names,
        data.name,
        data.keywords,
        data.emoticons,
      );

      this.names[data.unified] = data;
      for (const n of data.short_names) {
        this.names[n] = data;
      }
    });
  }
  getData(
    emoji: EmojiData | string,
    skin?: Emoji['skin'],
    set?: Emoji['set'],
  ): EmojiData {
    let emojiData: any;

    if (typeof emoji === 'string') {
      const matches = emoji.match(COLONS_REGEX);

      if (matches) {
        emoji = matches[1];

        if (matches[2]) {
          skin = (<Emoji['skin']>parseInt(matches[2], 10));
        }
      }
      emojiData = this.names[emoji];
    } else if (emoji.id) {
      emojiData = this.names[emoji.id];
      // if (skin) {
      //   skin = emoji.skin;
      // }
    }

    if (!emojiData) {
      emojiData = emoji;
      emojiData.custom = true;

      if (!emojiData.search && typeof emoji !== 'string') {
        emojiData.search = this.buildSearch(
          emoji.short_names,
          emoji.name,
          emoji.keywords,
          emoji.emoticons,
        );
      }
    }

    if (emojiData.emoticons) {
      emojiData.emoticons = [];
    }
    if (emojiData.variations) {
      emojiData.variations = [];
    }

    if (emojiData.skin_variations && emojiData.skin_variations.length && skin && skin > 1 && set) {
      emojiData = { ...emojiData };

      const skinKey = SKINS[skin - 1];
      const variationData = emojiData.skin_variations.find(
        (n: EmojiData) => n.unified.indexOf(skinKey) !== -1,
      );

      if (!variationData.variations && emojiData.variations) {
        delete emojiData.variations;
      }

      if (!variationData.hidden || variationData.hidden.indexOf(set) === -1) {
        emojiData.skin_tone = skin;
        emojiData = { ...emojiData, ...variationData };
      }
      emojiData.native = this.unifiedToNative(emojiData.unified);
    }

    if (emojiData.variations && emojiData.variations.length) {
      emojiData = { ...emojiData };
      emojiData.unified = emojiData.variations.shift();
    }

    return emojiData;
  }

  buildSearch(
    short_names: string[],
    name: string,
    keywords: string[],
    emoticons: string[],
  ) {
    const search: string[] = [];

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

    addToSearch(short_names, true);
    addToSearch(name, true);
    addToSearch(keywords, false);
    addToSearch(emoticons, false);

    return search.join(',');
  }
  unifiedToNative(unified: string) {
    const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
    return String.fromCodePoint(...codePoints);
  }
  sanitize(emoji: EmojiData) {
    const id = emoji.id || emoji.short_names[0];
    let colons = `:${id}:`;

    if (emoji.custom) {
      return {
        id,
        colons,
        name: emoji.name,
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
      colons,
      name: emoji.name,
      emoticons: emoji.emoticons,
      unified: emoji.unified.toLowerCase(),
      skin: emoji.skin_tone || (emoji.skin_variations ? 1 : null),
      native: this.unifiedToNative(emoji.unified),
    };
  }
  getSanitizedData(emoji: string | EmojiData, skin?: Emoji['skin'], set?: Emoji['set']) {
    return this.sanitize(this.getData(emoji, skin, set));
  }
}
