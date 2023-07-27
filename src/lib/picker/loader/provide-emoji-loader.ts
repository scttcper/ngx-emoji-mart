import {
  NgModule,
  EnvironmentProviders,
  ModuleWithProviders,
  makeEnvironmentProviders,
} from '@angular/core';

import { EmojiLoaderOptions, EMOJI_LOADER_OPTIONS } from './symbols';

@NgModule()
export class EmojiLoaderModule {
  static forRoot(options: EmojiLoaderOptions): ModuleWithProviders<EmojiLoaderModule> {
    return {
      ngModule: EmojiLoaderModule,
      providers: [{ provide: EMOJI_LOADER_OPTIONS, useValue: options }],
    };
  }
}

export function provideEmojiLoader(options: EmojiLoaderOptions): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: EMOJI_LOADER_OPTIONS, useValue: options }]);
}
