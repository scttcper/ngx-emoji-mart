export interface EmojiCategory {
  id: string;
  name: string;
  emojis: string[];
}

export interface EmojiData {
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
  search?: any;
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
