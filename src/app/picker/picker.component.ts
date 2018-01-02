import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styles: []
})
export class PickerComponent implements OnInit {
  emojiSize = 24;
  perLine = 9;
  i18n = {};
  style = {};
  title = 'Emoji Mart™';
  emoji = 'department_store';
  color = '#ae65c5';
  // set = Emoji.defaultProps.set;
  // skin = Emoji.defaultProps.skin;
  // native = Emoji.defaultProps.native;
  // sheetSize = Emoji.defaultProps.sheetSize;
  // backgroundImageFn = Emoji.defaultProps.backgroundImageFn;
  emojisToShowFilter = null;
  showPreview = true;
  // emojiTooltip = Emoji.defaultProps.tooltip;
  autoFocus = false;
  custom = [];

  constructor() { }

  ngOnInit() {
  }

}
