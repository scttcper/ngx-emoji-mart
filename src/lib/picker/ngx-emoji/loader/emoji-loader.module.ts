import { ModuleWithProviders, NgModule } from '@angular/core';

import { EmojiLoaderService } from './emoji-loader.service';
import { EmojiLoaderOptions, EMOJI_LOADER_OPTIONS } from './symbols';

@NgModule()
export class EmojiLoaderModule {
  static forRoot(options: EmojiLoaderOptions): ModuleWithProviders<EmojiLoaderModule> {
    return {
      ngModule: EmojiLoaderModule,
      providers: [EmojiLoaderService, { provide: EMOJI_LOADER_OPTIONS, useValue: options }],
    };
  }
}
