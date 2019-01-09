import { Component } from '@angular/core';
import { EmojiEvent } from '../lib/emoji/public_api';

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    shortNames: ['parrot'],
    keywords: ['party'],
    imageUrl: './assets/images/parrot.gif',
  },
  {
    name: 'Octocat',
    shortNames: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7',
  },
  {
    name: 'Squirrel',
    shortNames: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/shipit.png?v7',
  },
  {
    name: 'Test Flag',
    shortNames: ['test'],
    keywords: ['test', 'flag'],
    spriteUrl:
      'https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/sheets-256/64.png',
    sheet_x: 1,
    sheet_y: 1,
    size: 64,
    sheetColumns: 52,
    sheetRows: 52,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  themes = [
    'native',
    'apple',
    'google',
    'twitter',
    'emojione',
    'messenger',
    'facebook',
  ];
  set = 'native';
  native = true;
  CUSTOM_EMOJIS = CUSTOM_EMOJIS;

  setTheme(set: string) {
    this.native = set === 'native';
    this.set = set;
  }
  handleClick($event: EmojiEvent) {
    console.log($event.emoji);
  }
}
