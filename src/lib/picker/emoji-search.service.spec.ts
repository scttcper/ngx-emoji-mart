import { TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { EmojiData, EmojiLoaderModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { categories, emojis, skins } from './emojis';
import { EmojiSearch } from './emoji-search.service';

describe('EmojiSearch', () => {
  let es: EmojiSearch;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        EmojiLoaderModule.forRoot({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    es = TestBed.inject(EmojiSearch);
  });

  it('should return nothing', async () => {
    expect(await firstValueFrom(es.search(''))).toEqual(null);
  });

  it('should search', async () => {
    const res = await firstValueFrom(es.search('pineapple'));
    expect(res).toBeDefined();
    expect(res!.length).toBe(1);
    expect(res![0].name).toBe('Pineapple');
  });

  it('should filter only emojis we care about, exclude pineapple', async () => {
    const emojisToShowFilter = (data: EmojiData) => {
      return data.unified !== '1F34D';
    };
    const res = await firstValueFrom(es.search('apple', emojisToShowFilter));
    const apples = res!.map(obj => obj.id);
    expect(apples.length).toBe(3);
    expect(apples).not.toContain('pineapple');
  });

  it('can include/exclude categories', async () => {
    expect(await firstValueFrom(es.search('flag', undefined, undefined, ['people']))).toEqual([]);
  });

  it('can search for thinking_face', async () => {
    const res = await firstValueFrom(es.search('thinking_fac'));
    expect(res!.map((x: any) => x.id)).toEqual(['thinking_face']);
  });

  it('can search for woman-facepalming', async () => {
    const res = await firstValueFrom(es.search('woman-facep'));
    expect(res!.map(x => x.id)).toEqual(['woman-facepalming']);
  });
});
