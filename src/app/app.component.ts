import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../environments/environment';
import { EmojiComponent, EmojiEvent } from '../lib/picker/ngx-emoji';
import { PickerComponent } from '../lib/picker/picker.component';
import { FooterComponent } from './footer.component';

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
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
  {
    name: 'Squirrel',
    shortNames: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, PickerComponent, EmojiComponent, FooterComponent],
})
export class AppComponent {
  themes = ['native', 'apple', 'google', 'twitter', 'facebook'];
  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  );
  darkestMode: undefined | boolean = undefined;
  set = 'native';
  native = true;
  CUSTOM_EMOJIS = CUSTOM_EMOJIS;

  readonly environment = environment;

  setTheme(set: string) {
    this.native = set === 'native';
    this.set = set;
  }
  setDarkmode(mode: boolean | undefined) {
    if (mode === undefined) {
      this.darkestMode = mode;
      this.darkMode = !!(
        typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
      );
    } else {
      this.darkMode = mode;
      this.darkestMode = mode;
    }
  }
  handleClick($event: EmojiEvent) {
    console.log($event.emoji);
  }
  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}
