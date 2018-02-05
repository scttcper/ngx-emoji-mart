import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { EmojiData } from './data/data.interfaces';
import { EmojiService } from './emoji.service';

export interface Emoji {
  native: boolean;
  forceSize: boolean;
  tooltip: boolean;
  skin: 1 | 2 | 3 | 4 | 5 | 6;
  sheetSize: 16 | 20 | 32 | 64;
  set: 'apple' | 'google' | 'twitter' | 'emojione' | 'messenger' | 'facebook';
  size: number;
  emoji: string | EmojiData;
  backgroundImageFn: (set: string, sheetSize: Emoji['sheetSize']) => string;
  fallback: (data: any) => string;
  emojiOver: EventEmitter<EmojiEvent>;
  emojiLeave: EventEmitter<EmojiEvent>;
  emojiClick: EventEmitter<EmojiEvent>;
}

export interface EmojiEvent {
  emoji: EmojiData;
  $event: Event;
}

@Component({
  selector: 'ngx-emoji',
  template: `
  <span
    *ngIf="isVisible"
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
export class EmojiComponent implements OnChanges, Emoji {
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
  isVisible = true;
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  @Input()
  backgroundImageFn: Emoji['backgroundImageFn'] = (set: string, sheetSize: number) =>
    `https://unpkg.com/emoji-datasource-${this.set}@4.0.3/img/${
      this.set
    }/sheets-256/${this.sheetSize}.png`

  constructor(
    private emojiService: EmojiService,
  ) {}

  ngOnChanges() {
    if (!this.emoji) {
      return this.isVisible = false;
    }
    const data = this.getData();
    if (!data) {
      return this.isVisible = false;
    }

    const { unified, custom, short_names, imageUrl, obsoleted_by, native } = data;
    // const children = this.children;
    this.unified = null;
    if (custom) {
      this.custom = custom;
    }

    if (!unified && !custom) {
      return this.isVisible = false;
    }

    if (this.tooltip) {
      this.title = short_names[0];
    }

    if (obsoleted_by) {
      return this.isVisible = false;
    }

    if (this.native && unified && native) {
      // hide older emoji before the split into gendered emoji
      this.style = { fontSize: `${this.size}px` };
      this.unified = native;

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
      let setHasEmoji = true;
      if (data.hidden && data.hidden.indexOf(this.set) !== -1) {
        setHasEmoji = true;
      }

      if (!setHasEmoji) {
        if (this.fallback) {
          this.style = { fontSize: `${this.size}px` };
          this.unified = this.fallback(data);
        } else {
          return this.isVisible = false;
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
    return this.isVisible = true;
  }

  getPosition() {
    const [sheet_x, sheet_y] = this.getData().sheet;
    const multiply = 100 / (this.SHEET_COLUMNS - 1);
    return `${multiply * sheet_x}% ${multiply * sheet_y}%`;
  }

  getData() {
    return this.emojiService.getData(this.emoji, this.skin, this.set);
  }

  getSanitizedData() {
    return this.emojiService.getSanitizedData(this.emoji, this.skin, this.set);
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
