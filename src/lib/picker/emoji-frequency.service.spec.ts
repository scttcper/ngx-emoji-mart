import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';

describe('EmojiFrequently', () => {
  beforeEach(
    waitForAsync(() => {
      localStorage.clear();
      TestBed.configureTestingModule({}).compileComponents();
    }),
  );

  it(
    'should get default',
    inject([EmojiFrequentlyService], (ef: EmojiFrequentlyService) => {
      const defaults = ef.get(ef.DEFAULTS.length, 4);
      expect(defaults.length).toEqual(ef.DEFAULTS.length);
    }),
  );

  it(
    'should get shorter default',
    inject([EmojiFrequentlyService], (ef: EmojiFrequentlyService) => {
      const defaults = ef.get(8, 4);
      expect(defaults.length).toEqual(8);
    }),
  );

  it(
    'should add emoji',
    inject(
      [EmojiFrequentlyService, EmojiService],
      (ef: EmojiFrequentlyService, es: EmojiService) => {
        const pineapple = es.getData('pineapple');
        ef.get(8, 4);
        ef.add(pineapple!);
        const result = ef.get(8, 4);
        expect(result.length).toEqual(9);
      },
    ),
  );
});
