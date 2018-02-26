import { async, inject, TestBed } from '@angular/core/testing';

import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';

describe('EmojiFrequently', () => {
  beforeEach(
    async(() => {
      localStorage.clear();
      TestBed.configureTestingModule({
        providers: [EmojiFrequentlyService, EmojiService],
      }).compileComponents();
    }),
  );

  it(
    'should get default',
    inject([EmojiFrequentlyService], (ef: EmojiFrequentlyService) => {
      const defaults = ef.get(ef.DEFAULTS.length);
      expect(defaults.length).toEqual(ef.DEFAULTS.length);
    }),
  );

  it(
    'should get shorter default',
    inject([EmojiFrequentlyService], (ef: EmojiFrequentlyService) => {
      const defaults = ef.get(8);
      expect(defaults.length).toEqual(8);
    }),
  );

  it(
    'should add emoji',
    inject(
      [EmojiFrequentlyService, EmojiService],
      (ef: EmojiFrequentlyService, es: EmojiService) => {
        const pineapple = es.getData('pineapple');
        ef.get(8);
        ef.add(pineapple);
        const result = ef.get(8);
        expect(result.length).toEqual(9);
      },
    ),
  );
});
