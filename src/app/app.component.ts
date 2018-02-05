import { Component } from '@angular/core';

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    short_names: ['parrot'],
    keywords: ['party'],
    imageUrl: './assets/images/parrot.gif',
  },
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7',
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/shipit.png?v7',
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
  handleClick($event: any) {
    console.log($event);
  }
}
