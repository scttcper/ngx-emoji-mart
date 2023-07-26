import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, forkJoin, Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import type { SkinData, EmojiCategory, CompressedEmojiData } from '@ctrl/ngx-emoji-mart/types';

import { EmojiLoaderOptions, EMOJI_LOADER_OPTIONS } from './symbols';

@Injectable({ providedIn: 'root' })
export class EmojiLoaderService implements OnDestroy {
  private data$ = defer(() =>
    forkJoin([this.options.skins(), this.options.emojis(), this.options.categories()]),
  ).pipe(
    map(([skins, emojis, categories]) => ({ skins, emojis, categories })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private destroy$ = new Subject<void>();

  constructor(@Inject(EMOJI_LOADER_OPTIONS) private options: EmojiLoaderOptions) {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getSkins(): Observable<SkinData[]> {
    return this.data$.pipe(map(({ skins }) => skins));
  }

  getEmojis(): Observable<CompressedEmojiData[]> {
    return this.data$.pipe(map(({ emojis }) => emojis));
  }

  getCategories(): Observable<EmojiCategory[]> {
    return this.data$.pipe(map(({ categories }) => categories));
  }
}
