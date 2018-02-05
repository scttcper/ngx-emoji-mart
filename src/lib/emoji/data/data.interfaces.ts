import { Emoji } from '../emoji.component';

export interface EmojiCategory {
  id: string;
  name: string;
  emojis: string[];
  first?: boolean;
}

export interface CompressedEmojiData {
  name: string;
  unified: string;
  short_name: string;
  short_names?: string[];
  sheet: [number, number];
  keywords?: string[];
  hidden?: string[];
  emoticons?: string[];
  text?: string;
  skin_variations?: EmojiVariaiton[];
  obsoleted_by?: string;
  obsoletes?: string;
}

export interface EmojiData {
  id: string;
  name: string;
  unified?: string;
  short_name: string;
  short_names: string[];
  sheet: [number, number];
  keywords: string[];
  hidden: string[];
  emoticons: string[];
  text: string;
  skin_variations: EmojiVariaiton[];
  obsoleted_by?: string;
  obsoletes?: string;
  // search: any;
  skin_tone?: Emoji['skin'];
  custom?: boolean;
  native?: string;
  imageUrl?: string;
  colons?: string;
  skin?: Emoji['skin'];
}

export interface EmojiVariaiton {
  unified: string;
  sheet: [number, number];
  hidden?: string[];
}

export interface SkinData {
  name: string;
  unified: string;
  short_name: string;
  hidden: string[];
  sheet: [number, number];
}
