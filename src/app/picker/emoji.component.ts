import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { getData, getSanitizedData, unifiedToNative } from '../utils';

export interface Emoji {
  native: boolean;
  forceSize: boolean;
  tooltip: boolean;
  skin: 1 | 2 | 3 | 4 | 5 | 6;
  sheetSize: 16 | 20 | 32 | 64;
  set: 'apple' | 'google' | 'twitter' | 'emojione' | 'messenger' | 'facebook';
  size: number;
  emoji: string | object;
  backgroundImageFn: (set: string, sheetSize: Emoji['sheetSize']) => string;
  fallback: (data: any) => string;
  emojiOver: EventEmitter<EmojiEvent>;
  emojiLeave: EventEmitter<EmojiEvent>;
  emojiClick: EventEmitter<EmojiEvent>;
}

export interface EmojiEvent {
  emoji: string | object;
  $event: Event;
}

@Component({
  selector: 'ngx-emoji',
  template: `
  <span
    (click)="handleClick($event)"
    (mouseenter)="handleOver($event)"
    (mouseleave)="handleLeave($event)"
    [title]="title"
    class="emoji-mart-emoji {{ className }}"
    [class.emoji-mart-emoji-native]="native"
    [class.emoji-mart-emoji-custom]="custom"
  >
    <span [ngStyle]="style">
      {{ unified }}
      <ng-content></ng-content>
    </span>
  </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class EmojiComponent implements OnChanges {
  @Input() skin: Emoji['skin'] = 1;
  @Input() set: Emoji['set'] = 'apple';
  @Input() sheetSize: Emoji['sheetSize'] = 64;
  @Input() native: Emoji['native'] = false;
  @Input() forceSize: Emoji['forceSize'] = false;
  @Input() tooltip: Emoji['tooltip'] = false;
  @Input() size: Emoji['size'];
  @Input() emoji: Emoji['emoji'];
  @Input() fallback: Emoji['fallback'];
  @Output() emojiOver: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiLeave: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClick: Emoji['emojiClick'] = new EventEmitter();
  style: any;
  title = '';
  unified: string | null;
  custom: boolean;
  SHEET_COLUMNS = 52;
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  @Input()
  backgroundImageFn: Emoji['backgroundImageFn'] = (set: string, sheetSize: number) =>
    `https://unpkg.com/emoji-datasource-${this.set}@4.0.3/img/${
      this.set
    }/sheets-256/${this.sheetSize}.png`

  constructor() {}

  ngOnChanges() {
    const data = this.getData();
    if (!data) {
      return null;
    }

    const { unified, custom, short_names, imageUrl } = data;
    // const children = this.children;
    const title = null;
    this.unified = null;
    this.custom = custom;

    if (!unified && !custom) {
      return null;
    }

    if (this.tooltip) {
      this.title = short_names[0];
    }

    if (this.native && unified) {
      this.style = { fontSize: `${this.size}px` };
      this.unified = unifiedToNative(unified);

      if (this.forceSize) {
        this.style.display = 'inline-block';
        this.style.width = `${this.size}px`;
        this.style.height = `${this.size}px`;
      }
    } else if (custom) {
      this.style = {
        width: `${this.size}px`,
        height: `${this.size}px`,
        display: 'inline-block',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
      };
    } else {
      const setHasEmoji = this.getData()[`has_img_${this.set}`];

      if (!setHasEmoji) {
        if (this.fallback) {
          this.style = { fontSize: `${this.size}px` };
          this.unified = this.fallback(data);
        } else {
          return null;
        }
      } else {
        this.style = {
          width: `${this.size}px`,
          height: `${this.size}px`,
          display: 'inline-block',
          backgroundImage: `url(${this.backgroundImageFn(
            this.set,
            this.sheetSize,
          )})`,
          backgroundSize: `${100 * this.SHEET_COLUMNS}%`,
          backgroundPosition: this.getPosition(),
        };
      }
    }
  }

  getPosition() {
    const { sheet_x, sheet_y } = this.getData();
    const multiply = 100 / (this.SHEET_COLUMNS - 1);
    return `${multiply * sheet_x}% ${multiply * sheet_y}%`;
  }

  getData() {
    return getData(this.emoji, this.skin, this.set);
  }

  getSanitizedData() {
    return getSanitizedData(this.emoji, this.skin, this.set);
  }

  handleClick($event: Event) {
    const emoji = this.getSanitizedData();
    this.emojiClick.emit({ emoji, $event });
  }

  handleOver($event: Event) {
    const emoji = this.getSanitizedData();
    this.emojiOver.emit({ emoji, $event });
  }

  handleLeave($event: Event) {
    const emoji = this.getSanitizedData();
    this.emojiLeave.emit({ emoji, $event });
  }
}
