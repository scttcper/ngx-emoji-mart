import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'emoji-skins',
  template: `
  <div>
    <div class="emoji-mart-skin-swatches" [class.emoji-mart-skin-swatches-opened]="opened">
      <span *ngFor="let skinTone of skinTones"
        class="emoji-mart-skin-swatch"
        [class.emoji-mart-skin-swatch-selected]="skinTone === skin"
        >
          <span (click)="this.handleClick(skinTone)"
            class="emoji-mart-skin emoji-mart-skin-tone-{{ skinTone }}"
          ></span>
        </span>
    </div>
  </div>
  `,
})
export class SkinComponent implements OnInit {
  @Input() skin: any;
  @Output() change = new EventEmitter<number>();
  opened = false;
  skinTones = [1, 2, 3, 4, 5, 6];

  constructor() {}

  ngOnInit() {
    console.log(this.skin);
  }

  toggleOpen() {
    this.opened = !this.opened;
  }

  handleClick(skin) {
    if (!this.opened) {
      this.opened = true;
    } else {
      this.opened = false;
      if (skin !== this.skin) {
        this.change.emit(skin);
      }
    }
  }
}
