import { Injectable } from '@angular/core';

import {
  CompressedEmojiData,
  EmojiData,
  EmojiVariation,
} from './data/data.interfaces';
import { emojis } from './data/emojis';
import { Emoji } from './emoji.component';

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

@Injectable()
export class EmojiService {
  uncompressed = false;
  names: { [key: string]: EmojiData } = {};
  emojis: EmojiData[] = [];

  constructor() {
    if (!this.uncompressed) {
      this.uncompress(emojis);
      this.uncompressed = true;
    }
  }

  uncompress(list: CompressedEmojiData[]) {
    this.emojis = list.map(emoji => {
      const data: any = { ...emoji };
      if (!data.shortNames) {
        data.shortNames = [];
      }
      data.shortNames.unshift(data.short_name);
      data.id = data.short_name;
      data.native = this.unifiedToNative(data.unified);

      if (!data.skinVariations) {
        data.skinVariations = [];
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

      if (data.obsoletes) {
        // get keywords from emoji that it obsoletes since that is shared
        const f = list.find(x => x.unified === data.obsoletes);
        if (f) {
          if (f.keywords) {
            data.keywords = [...data.keywords, ...f.keywords, f.shortName];
          } else {
            data.keywords = [...data.keywords, f.shortName];
          }
        }
      }

      this.names[data.unified] = data;
      for (const n of data.shortNames) {
        this.names[n] = data;
      }
      return data;
    });
  }

  getData(
    emoji: EmojiData | string,
    skin?: Emoji['skin'],
    set?: Emoji['set'],
  ): EmojiData | null {
    let emojiData: any;

    if (typeof emoji === 'string') {
      const matches = emoji.match(COLONS_REGEX);

      if (matches) {
        emoji = matches[1];

        if (matches[2]) {
          skin = parseInt(matches[2], 10) as Emoji['skin'];
        }
      }
      if (this.names.hasOwnProperty(emoji)) {
        emojiData = this.names[emoji];
      } else {
        return null;
      }
    } else if (emoji.id) {
      emojiData = this.names[emoji.id];
    }

    if (!emojiData) {
      emojiData = emoji;
      emojiData.custom = true;
    }

    const hasSkinVariations = emojiData.skinVariations && emojiData.skinVariations.length;
    if (hasSkinVariations && skin && skin > 1 && set) {
      emojiData = { ...emojiData };

      const skinKey = SKINS[skin - 1];
      const variationData = emojiData.skinVariations.find(
        (n: EmojiVariation) => n.unified.includes(skinKey),
      );

      if (!variationData.variations && emojiData.variations) {
        delete emojiData.variations;
      }

      if (!variationData.hidden || !variationData.hidden.includes(set)) {
        emojiData.skinTone = skin;
        emojiData = { ...emojiData, ...variationData };
      }
      emojiData.native = this.unifiedToNative(emojiData.unified);
    }

    if (emojiData.variations && emojiData.variations.length) {
      emojiData = { ...emojiData };
      emojiData.unified = emojiData.variations.shift() as string;
    }

    emojiData.set = set || '';

    return emojiData as EmojiData;
  }

  unifiedToNative(unified: string) {
    const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
    return String.fromCodePoint(...codePoints);
  }

  sanitize(emoji: EmojiData | null): EmojiData | null {
    if (emoji === null) {
      return null;
    }
    const id = emoji.id || emoji.shortNames[0];
    let colons = `:${id}:`;
    if (emoji.skinTone) {
      colons += `:skin-tone-${emoji.skinTone}:`;
    }
    emoji.colons = colons;
    return { ...emoji };
  }

  getSanitizedData(
    emoji: string | EmojiData,
    skin?: Emoji['skin'],
    set?: Emoji['set'],
  ) {
    return this.sanitize(this.getData(emoji, skin, set));
  }
}
