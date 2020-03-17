export interface EmojiData {
  name: null | string;
  unified: string;
  non_qualified: null | string;
  docomo: null | string;
  au: null | string;
  softbank: null | string;
  google: null | string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  short_name: string;
  short_names: string[];
  text: null | string;
  texts: string[] | null;
  category: Category;
  sort_order: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  skin_variations?: { [key: string]: SkinVariation };
  obsoletes?: string;
  obsoleted_by?: string;
}

export enum Category {
  Activities = 'Activities',
  AnimalsNature = 'Animals & Nature',
  Flags = 'Flags',
  FoodDrink = 'Food & Drink',
  Objects = 'Objects',
  PeopleBody = 'People & Body',
  SkinTones = 'Skin Tones',
  SmileysEmotion = 'Smileys & Emotion',
  Symbols = 'Symbols',
  TravelPlaces = 'Travel & Places'
}

export interface SkinVariation {
  unified: string;
  non_qualified: null | string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  obsoletes?: string;
  obsoleted_by?: string;
}
