import { Injectable } from '@angular/core';

import * as store from '../utils/store';

const DEFAULTS = [
  '+1',
  'grinning',
  'kissing_heart',
  'heart_eyes',
  'laughing',
  'stuck_out_tongue_winking_eye',
  'sweat_smile',
  'joy',
  'scream',
  'disappointed',
  'unamused',
  'weary',
  'sob',
  'sunglasses',
  'heart',
  'poop',
];

@Injectable()
export class EmojiFrequentlyService {
  frequently: { [key: string]: number };
  defaults: { [key: string]: number } = {};

  constructor() {
    this.frequently = store.get('frequently');
  }
  add(emoji) {
    const { id } = emoji;

    if (!this.frequently) {
      this.frequently = this.defaults;
    }
    if (!this.frequently[id]) {
      this.frequently[id] = 0;
    }
    this.frequently[id] += 1;

    store.set('last', id);
    store.set('frequently', this.frequently);
  }
  get(perLine) {
    if (!this.frequently) {
      this.defaults = {};

      const result = [];

      for (let i = 0; i < perLine; i++) {
        this.defaults[DEFAULTS[i]] = perLine - i;
        result.push(DEFAULTS[i]);
      }
      return result;
    }

    const quantity = perLine * 4;
    const frequentlyKeys = Object.keys(this.frequently);

    const sorted = frequentlyKeys
      .sort((a, b) => this.frequently[a] - this.frequently[b])
      .reverse();
    const sliced = sorted.slice(0, quantity);

    const last = store.get('last');

    if (last && sliced.indexOf(last) === -1) {
      sliced.pop();
      sliced.push(last);
    }

    return sliced;
  }
}
