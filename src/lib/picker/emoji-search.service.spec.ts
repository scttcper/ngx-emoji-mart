import { async, inject, TestBed } from '@angular/core/testing';

import { EmojiData, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiSearch } from './emoji-search.service';

describe('EmojiSearch', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [EmojiSearch, EmojiService],
      }).compileComponents();
    }),
  );

  it(
    'should return nothing',
    inject([EmojiSearch], (es: EmojiSearch) => {
      expect(es.search('')).toEqual(null);
    }),
  );

  it(
    'should search',
    inject([EmojiSearch], (es: EmojiSearch) => {
      const res = es.search('pineapple');
      expect(res).toBeDefined();
      expect(res!.length).toBe(1);
      expect(res![0]).toEqual({
        name: 'Pineapple',
        unified: '1F34D',
        short_name: 'pineapple',
        keywords: ['fruit', 'nature', 'food'],
        sheet: [7, 15],
        short_names: ['pineapple'],
        id: 'pineapple',
        native: '🍍',
        skin_variations: [],
        emoticons: [],
        hidden: [],
        text: '',
        colons: ':pineapple:',
        set: '',
      });
    }),
  );

  it(
    'should filter only emojis we care about, exclude pineapple',
    inject([EmojiSearch], (es: EmojiSearch) => {
      const emojisToShowFilter = (data: EmojiData) => {
        return data.unified !== '1F34D';
      };
      const apples = es.search('apple', emojisToShowFilter)!.map(obj => obj.id);
      expect(apples.length).toBe(3);
      expect(apples).not.toContain('pineapple');
    }),
  );

  it(
    'can include/exclude categories',
    inject([EmojiSearch], (es: EmojiSearch) => {
      expect(es.search('flag', undefined, undefined, ['people'])).toEqual([]);
    }),
  );

  it(
    'can search for thinking_face',
    inject([EmojiSearch], (es: EmojiSearch) => {
      expect(es.search('thinking_fac')!.map((x: any) => x.id)).toEqual([
        'thinking_face',
      ]);
    }),
  );

  it(
    'can search for woman-facepalming',
    inject([EmojiSearch], (es: EmojiSearch) => {
      expect(es.search('woman-facep')!.map(x => x.id)).toEqual([
        'woman-facepalming',
      ]);
    }),
  );
});
