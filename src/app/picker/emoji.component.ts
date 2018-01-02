import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { getData, getSanitizedData, unifiedToNative } from '../utils';

const SHEET_COLUMNS = 52;

const _getPosition = props => {
  const { sheet_x, sheet_y } = _getData(props),
    multiply = 100 / (SHEET_COLUMNS - 1);

  return `${multiply * sheet_x}% ${multiply * sheet_y}%`;
};

const _getData = props => {
  const { emoji, skin, set } = props;
  return getData(emoji, skin, set);
};

const _getSanitizedData = props => {
  const { emoji, skin, set } = props;
  return getSanitizedData(emoji, skin, set);
};

const _handleClick = (e, props) => {
  if (!props.onClick) {
    return;
  }
  const { onClick } = props;
  const emoji = _getSanitizedData(props);

  onClick(emoji, e);
};

const _handleOver = (e, props) => {
  if (!props.onOver) {
    return;
  }
  const { onOver } = props;
  const emoji = _getSanitizedData(props);

  onOver(emoji, e);
};

const _handleLeave = (e, props) => {
  if (!props.onLeave) {
    return;
  }
  const { onLeave } = props;
  const emoji = _getSanitizedData(props);

  onLeave(emoji, e);
};


@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styles: []
})
export class EmojiComponent implements OnInit {
  @Input() skin: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  @Input() set: 'apple' | 'google' | 'twitter' | 'emojione' | 'messenger' | 'facebook' = 'apple';
  @Input() sheetSize: 16 | 20 | 32 | 64 = 64;
  @Input() native = false;
  @Input() forceSize = false;
  @Input() tooltip = false;
  @Input() size: number;
  @Input() emoji: string | object;
  @Output() over = new EventEmitter<any>();
  @Output() leave = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  backgroundImageFn = (set, sheetSize) =>
    `https://unpkg.com/emoji-datasource-${this.set}@4.0.3/img/${this.set}/sheets-256/${this.sheetSize}.png`;


  constructor() { }

  ngOnInit() {
  }

}
