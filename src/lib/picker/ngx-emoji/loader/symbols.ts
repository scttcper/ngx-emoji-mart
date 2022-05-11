import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import type { SkinData, EmojiCategory, CompressedEmojiData } from '../data/data.interfaces';

export interface EmojiLoaderOptions {
  emojis: () => Observable<CompressedEmojiData[]>;
  categories: () => Observable<EmojiCategory[]>;
  skins: () => Observable<SkinData[]>;
}

export const EMOJI_LOADER_OPTIONS = new InjectionToken('EmojiLoaderOptions');
