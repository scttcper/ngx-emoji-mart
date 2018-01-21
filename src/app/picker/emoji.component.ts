import {
  Component,
  OnChanges,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { getData, getSanitizedData, unifiedToNative } from '../utils';

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
  @Input() skin: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  @Input()
  set:
    | 'apple'
    | 'google'
    | 'twitter'
    | 'emojione'
    | 'messenger'
    | 'facebook' = 'apple';
  @Input() sheetSize: 16 | 20 | 32 | 64 = 64;
  @Input() native = false;
  @Input() forceSize = false;
  @Input() tooltip = false;
  @Input() size: number;
  @Input() emoji: string | object;
  @Input() fallback: (data: any) => string;
  @Output() over = new EventEmitter<any>();
  @Output() leave = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
  style: any;
  title = '';
  unified: string | null;
  custom: boolean;
  SHEET_COLUMNS = 52;
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  @Input()
  backgroundImageFn = (set, sheetSize) =>
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
    const style = {};
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

  handleClick($event) {
    const emoji = this.getSanitizedData();
    this.click.emit({ emoji, $event });
  }

  handleOver($event) {
    const emoji = this.getSanitizedData();
    this.over.emit({ emoji, $event });
  }

  handleLeave($event) {
    const emoji = this.getSanitizedData();
    this.leave.emit({ emoji, $event });
  }
}
