import { ApplicationConfig } from '@angular/core';
import { provideEmojiLoader } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { from, map } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEmojiLoader({
      skins: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.skins)),
      emojis: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.emojis)),
      categories: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.categories)),
    }),
  ],
};
