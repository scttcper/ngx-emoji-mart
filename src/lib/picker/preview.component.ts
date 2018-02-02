import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import { getData } from '../utils';

@Component({
  selector: 'emoji-preview',
  template: `
  <div class="emoji-mart-preview" *ngIf="emoji">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji [emoji]="emoji" [size]="38"
        [native]="emojiNative"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [backgroundImageFn]="emojiBackgroundImageFn"
      >
      </ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>
      <div class="emoji-mart-preview-shortnames">

        <span class="emoji-mart-preview-shortname" *ngFor="let short_name of emojiData.short_names">
          :{{ short_name }}:
        </span>

      </div>
      <div class="emoji-mart-preview-emoticons">

        <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">
          {{ emoticon }}
        </span>

      </div>
    </div>
  </div>

  <div class="emoji-mart-preview" *ngIf="!emoji">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji *ngIf="idleEmoji && idleEmoji.length"
        [native]="emojiNative"
        [skin]="emojiSkin"
        [set]="emojiSet"
        [emoji]="idleEmoji"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [size]="38">
      </ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <span class="emoji-mart-title-label">{{ title }}</span>
    </div>

    <div class="emoji-mart-preview-skins">
      <emoji-skins [skin]="emojiSkin" (change)="skinChange.emit($event)"></emoji-skins>
    </div>
  </div>
  `,
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input() title: any;
  @Input() emoji: any;
  @Input() idleEmoji: any;
  @Input() emojiNative: any;
  @Input() emojiSize: any;
  @Input() emojiSkin: any;
  @Input() emojiSet: any;
  @Input() emojiSheetSize: any;
  @Input() emojiBackgroundImageFn: any;
  @Output() skinChange = new EventEmitter<number>();
  emojiData: any;
  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    if (!this.emoji) {
      return;
    }
    this.emojiData = getData(this.emoji);
    const emoticons = this.emojiData.emoticons || [];
    const knownEmoticons = [];
    const listedEmoticons = [];
    emoticons.forEach(emoticon => {
      if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
        return;
      }

      knownEmoticons.push(emoticon.toLowerCase());
      listedEmoticons.push(emoticon);
    });
  }
}
