import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, forkJoin, map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';

import { SkinData, EmojiCategory, CompressedEmojiData } from '../data/data.interfaces';

import { EmojiLoaderOptions, EMOJI_LOADER_OPTIONS } from './symbols';

@Injectable()
export class EmojiLoaderService implements OnDestroy {
  private data$ = defer(() =>
    forkJoin([this.options.skins(), this.options.emojis(), this.options.categories()]),
  ).pipe(
    map(([skins, emojis, categories]) => ({ skins, emojis, categories })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private requestedToLoad = false;

  private destroy$ = new Subject<void>();

  constructor(@Inject(EMOJI_LOADER_OPTIONS) private options: EmojiLoaderOptions) {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  requestToLoad(): void {
    if (this.requestedToLoad) {
      return;
    }

    this.requestedToLoad = true;

    // Note: we explicitly subscribe here to trigger the data loading. We don't need to pass any
    // `next` handler since we only want to start data loading and its caching further.
    this.data$.pipe(takeUntil(this.destroy$)).subscribe();
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
