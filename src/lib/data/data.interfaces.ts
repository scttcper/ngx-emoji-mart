export interface EmojiCategory {
  id: string;
  name: string;
  emojis: string[];
}

export interface EmojiData {
  name: string;
  unified: string;
  sheet: [number, number];
  keywords?: string[];
  hidden?: string[];
  emoticons?: string[];
  text?: string;
  skin_variations?: EmojiVariaiton[];
  short_names?: string[];
  obsoleted_by?: string;
  obsoletes?: string;
}

export interface EmojiVariaiton {
  unified: string;
  sheet: [number, number];
  hidden?: string[];
}

export interface SkinData {
  name: string,
  unified: string,
  hidden: string[],
  sheet: [number, number]
}
