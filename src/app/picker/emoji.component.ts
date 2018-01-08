import {
  Component,
  OnChanges,
  EventEmitter,
  Output,
  Input,
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
    class="{{className}}"
  >
    <span [ngStyle]="style"><ng-content></ng-content></span>
  </span>
  `,
  styles: [],
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
  @Output() over = new EventEmitter<any>();
  @Output() leave = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
  style: any;
  SHEET_COLUMNS = 52;
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  @Input()
  backgroundImageFn = (set, sheetSize) =>
    `https://unpkg.com/emoji-datasource-${this.set}@4.0.3/img/${
      this.set
    }/sheets-256/${this.sheetSize}.png`;

  constructor() {}

  ngOnChanges() {
    this.style = {
      width: this.size + 'px',
      height: this.size + 'px',
      display: 'inline-block',
      'background-image': `url(${this.backgroundImageFn(
        this.set,
        this.sheetSize,
      )})`,
      'background-size': `${100 * this.SHEET_COLUMNS}%`,
      'background-position': this.getPosition(),
    };
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
