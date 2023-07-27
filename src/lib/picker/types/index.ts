import { EventEmitter } from '@angular/core';

export interface EmojiEvent {
  emoji: EmojiData;
  $event: Event;
}

export interface Emoji {
  /** Renders the native unicode emoji */
  isNative: boolean;
  forceSize: boolean;
  tooltip: boolean;
  skin: 1 | 2 | 3 | 4 | 5 | 6;
  sheetSize: 16 | 20 | 32 | 64 | 72;
  sheetRows?: number;
  set: 'apple' | 'google' | 'twitter' | 'facebook' | '';
  size: number;
  emoji: string | EmojiData;
  backgroundImageFn: (set: string, sheetSize: number) => string;
  fallback?: (data: any, props: any) => string;
  emojiOver: EventEmitter<EmojiEvent>;
  emojiLeave: EventEmitter<EmojiEvent>;
  emojiClick: EventEmitter<EmojiEvent>;
  imageUrlFn?: (emoji: EmojiData | null) => string;
}

export interface EmojiCategory {
  id: string;
  name: string;
  emojis: any[] | null;
  anchor?: boolean;
  first?: boolean;
}

export interface CompressedEmojiData {
  name: string;
  unified: string;
  shortName: string;
  shortNames?: string[];
  sheet: [number, number];
  keywords?: string[];
  hidden?: string[];
  emoticons?: string[];
  text?: string;
  skinVariations?: EmojiVariation[];
  obsoletedBy?: string;
  obsoletes?: string;
}

export interface EmojiData {
  id: string;
  name: string;
  unified?: string;
  shortName: string;
  shortNames: string[];
  sheet: [number, number];
  keywords: string[];
  hidden: string[];
  emoticons: string[];
  text: string;
  set?: Emoji['set'];
  skinVariations: EmojiVariation[];
  obsoletedBy?: string;
  obsoletes?: string;
  skinTone?: Emoji['skin'];
  custom?: boolean;
  native?: string;
  imageUrl?: string;
  colons?: string;
  skin?: Emoji['skin'];
  spriteUrl?: string;
  sheetRows?: string;
}

export interface EmojiVariation {
  unified: string;
  sheet: [number, number];
  hidden?: string[];
}

export interface SkinData {
  name: string;
  unified: string;
  shortName: string;
  sheet: [number, number];
}
